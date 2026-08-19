"""
ai_auth_hud.py — face-authentication gate for the JARVIS edge agent.

Shows a HUD-style webcam overlay and only lets the agent proceed once it
recognizes your face — the "only Tony Stark can command Jarvis" gate.

Requires: opencv-contrib-python (plain opencv-python does NOT include
cv2.face — pip install opencv-contrib-python).

Usage:
    python ai_auth_hud.py --enroll "Your Name"   # capture ~30 samples, train model
    python ai_auth_hud.py                        # run the verification gate once

Or import authenticate() from edge_assistant_run.py to gate startup.
"""

import argparse
import os
import time

import cv2
import numpy as np

CASCADE_PATH = os.path.join(os.path.dirname(__file__), "haarcascade_frontalface.xml")
FACES_DIR = os.path.join(os.path.dirname(__file__), "faces")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "face_model.yml")

CYAN = (255, 225, 78)   # BGR
RED = (84, 84, 255)
GREEN = (176, 255, 77)


def _hud_frame(frame, text, color, subtext=""):
    h, w = frame.shape[:2]
    cv2.rectangle(frame, (0, 0), (w - 1, h - 1), color, 2)
    cv2.putText(frame, text, (16, h - 40), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)
    if subtext:
        cv2.putText(frame, subtext, (16, h - 14), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 1)
    return frame


def enroll(name: str, samples: int = 30):
    """Capture face samples from the webcam and (re)train the LBPH model."""
    cascade = cv2.CascadeClassifier(CASCADE_PATH)
    cap = cv2.VideoCapture(0)
    person_dir = os.path.join(FACES_DIR, name)
    os.makedirs(person_dir, exist_ok=True)

    count = 0
    print(f"[enroll] Look at the camera. Capturing {samples} samples for '{name}'...")
    while count < samples:
        ok, frame = cap.read()
        if not ok:
            break
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = cascade.detectMultiScale(gray, 1.1, 5, minSize=(120, 120))

        for (x, y, w, h) in faces:
            face_crop = gray[y:y + h, x:x + w]
            face_crop = cv2.resize(face_crop, (200, 200))
            cv2.imwrite(os.path.join(person_dir, f"{count:03d}.png"), face_crop)
            count += 1
            cv2.rectangle(frame, (x, y), (x + w, y + h), GREEN, 2)
            break  # one face per frame

        _hud_frame(frame, f"ENROLLING: {name}", CYAN, f"samples {count}/{samples}")
        cv2.imshow("JARVIS — Enroll", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
        time.sleep(0.08)

    cap.release()
    cv2.destroyAllWindows()
    print(f"[enroll] Captured {count} samples. Training model...")
    _train_model()


def _train_model():
    recognizer = cv2.face.LBPHFaceRecognizer_create()
    images, labels, label_names = [], [], {}

    if not os.path.isdir(FACES_DIR):
        print("[train] No faces/ directory yet — run --enroll first.")
        return

    for idx, name in enumerate(sorted(os.listdir(FACES_DIR))):
        person_dir = os.path.join(FACES_DIR, name)
        if not os.path.isdir(person_dir):
            continue
        label_names[idx] = name
        for fname in os.listdir(person_dir):
            img = cv2.imread(os.path.join(person_dir, fname), cv2.IMREAD_GRAYSCALE)
            if img is None:
                continue
            images.append(img)
            labels.append(idx)

    if not images:
        print("[train] No samples found — run --enroll first.")
        return

    recognizer.train(images, np.array(labels))
    recognizer.save(MODEL_PATH)
    with open(MODEL_PATH + ".labels", "w") as f:
        for idx, name in label_names.items():
            f.write(f"{idx},{name}\n")
    print(f"[train] Model saved to {MODEL_PATH} ({len(label_names)} identities).")


def _load_labels():
    labels = {}
    path = MODEL_PATH + ".labels"
    if os.path.exists(path):
        with open(path) as f:
            for line in f:
                idx, name = line.strip().split(",", 1)
                labels[int(idx)] = name
    return labels


def authenticate(timeout: float = 10.0, confidence_threshold: float = 70.0) -> bool:
    """
    Open the webcam, show the HUD scan overlay, and return True as soon as a
    known face is confirmed. If no model has been trained yet, falls back to
    a simple "a face is present" gate. Returns False on timeout / 'q' / no cam.
    """
    cascade = cv2.CascadeClassifier(CASCADE_PATH)
    has_model = os.path.exists(MODEL_PATH)
    recognizer = None
    labels = {}
    if has_model:
        recognizer = cv2.face.LBPHFaceRecognizer_create()
        recognizer.read(MODEL_PATH)
        labels = _load_labels()

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("[auth] No webcam found.")
        return False

    start = time.time()
    verified = False
    hold_frames = 0

    while time.time() - start < timeout:
        ok, frame = cap.read()
        if not ok:
            break
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = cascade.detectMultiScale(gray, 1.1, 5, minSize=(120, 120))

        label_text, color = "SCANNING…", CYAN

        for (x, y, w, h) in faces:
            if has_model:
                face_crop = cv2.resize(gray[y:y + h, x:x + w], (200, 200))
                pred_label, confidence = recognizer.predict(face_crop)
                # LBPH: LOWER confidence value = better match
                if confidence <= confidence_threshold:
                    name = labels.get(pred_label, "UNKNOWN")
                    label_text, color = f"ACCESS GRANTED — {name}", GREEN
                    hold_frames += 1
                else:
                    label_text, color = "IDENTITY NOT RECOGNIZED", RED
                    hold_frames = 0
            else:
                label_text, color = "FACE DETECTED (no model trained — presence-only gate)", GREEN
                hold_frames += 1

            cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)
            break

        if hold_frames >= 8:  # ~a few consistent frames before trusting it
            verified = True

        _hud_frame(frame, label_text, color, "press q to cancel")
        cv2.imshow("JARVIS — Identity Check", frame)

        if verified or (cv2.waitKey(1) & 0xFF == ord('q')):
            break

    cap.release()
    cv2.destroyAllWindows()
    return verified


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--enroll", metavar="NAME", help="capture face samples and train the model")
    args = parser.parse_args()

    if args.enroll:
        enroll(args.enroll)
    else:
        ok = authenticate()
        print("ACCESS GRANTED" if ok else "ACCESS DENIED")
