"""
Extracts project imagery (covers, gallery, floor plans, RERA QR codes) from the
brochures in public/brochure/ and writes web-sized JPEGs to public/images/projects/<slug>/.

Crops are fractions of the page: (left, top, right, bottom).
Run: python scripts/extract-brochure-images.py   (needs: pip install pymupdf)
"""
import io
import os
import pymupdf  # PyMuPDF

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "public", "brochure")
OUT = os.path.join(ROOT, "public", "images", "projects")

BROCHURES = {
    "ankur-grandeur": "Ankur Grandeur.pdf.pdf",
    "deep-emerald": "Deep Emarald Brochure.pdf",
    "deep-sky": "Deep Sky.pdf",
    "deep-crown": "Deep crown CDR open file 1.pdf",
    "deep-landmark": "Deep landmark.pdf",
    "mahavir-enclave": "Deep mahavir enclave big brochure 28 Aug 2024.pdf",
    "sky-industrial-hub": "SKY INDUSTRIAL HUB BROCHURE  SPREAD V4.pdf",
}

FULL = (0, 0, 1, 1)

# slug -> list of (output name, page number (1-based), crop, max width px)
JOBS = {
    "ankur-grandeur": [
        ("cover", 1, (0.08, 0.06, 0.92, 0.99), 1400),
        ("rooftop", 3, (0.0, 0.0, 1.0, 1.0), 1400),
        ("layout", 2, (0.0, 0.05, 1.0, 0.95), 1400),
        ("plan-1bhk", 5, (0.08, 0.1, 0.92, 0.9), 1600),
    ],
    "deep-emerald": [
        ("cover", 1, (0.18, 0.16, 0.86, 1.0), 1400),
        ("rooftop", 3, (0.0, 0.14, 1.0, 1.0), 1400),
        ("features", 2, FULL, 1400),
    ],
    "deep-crown": [
        ("cover", 1, (0.04, 0.06, 0.54, 1.0), 1400),
        ("amenities", 3, FULL, 1400),
        ("specs", 2, FULL, 1400),
        ("rera-qr", 4, (0.895, 0.885, 0.972, 0.965), 500),
    ],
    "deep-landmark": [
        ("cover", 1, (0.14, 0.2, 0.74, 1.0), 1400),
        ("lifestyle", 3, FULL, 1400),
        ("features", 2, FULL, 1400),
        ("rera-qr", 4, (0.886, 0.882, 0.962, 0.958), 500),
    ],
    "mahavir-enclave": [
        ("cover", 4, FULL, 1600),
        ("plan-1bhk", 7, FULL, 1600),
        ("plan-2bhk", 8, FULL, 1600),
        ("typical-floor", 10, FULL, 1600),
        ("lifestyle", 5, FULL, 1400),
    ],
    "deep-sky": [
        ("cover", 2, (0.33, 0.05, 0.87, 0.97), 1400),
        ("towers", 6, FULL, 1600),
        ("aerial", 13, FULL, 1600),
        ("plan-1bhk", 8, FULL, 1600),
        ("plan-2bhk", 9, FULL, 1600),
    ],
    "sky-industrial-hub": [
        ("cover", 4, (0.0, 0.0, 0.47, 1.0), 1600),
        ("gate", 2, (0.47, 0.0, 1.0, 1.0), 1600),
        ("warehouse", 3, (0.0, 0.0, 1.0, 0.62), 1800),
        ("floor-plan", 6, FULL, 2000),
    ],
}


def render(doc, page_no, crop, max_w):
    page = doc[page_no - 1]
    r = page.rect
    clip = pymupdf.Rect(r.x0 + crop[0] * r.width, r.y0 + crop[1] * r.height, r.x0 + crop[2] * r.width, r.y0 + crop[3] * r.height)
    zoom = max_w / clip.width
    pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), clip=clip)
    return pix.tobytes("jpeg", jpg_quality=82)


def main():
    for slug, jobs in JOBS.items():
        doc = pymupdf.open(os.path.join(SRC, BROCHURES[slug]))
        os.makedirs(os.path.join(OUT, slug), exist_ok=True)
        for name, page_no, crop, max_w in jobs:
            data = render(doc, page_no, crop, max_w)
            with open(os.path.join(OUT, slug, f"{name}.jpg"), "wb") as f:
                f.write(data)
        print(f"{slug}: {len(jobs)} images")


if __name__ == "__main__":
    main()
