FROM python:3.11-slim

WORKDIR /work

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY seed_and_test.py ./

ENV PYTHONUNBUFFERED=1

CMD ["python", "seed_and_test.py"]
