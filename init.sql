CREATE TABLE "roles" (
  "id" integer PRIMARY KEY,
  "name" varchar(50) UNIQUE NOT NULL
);

CREATE TABLE "users" (
  "id" integer PRIMARY KEY,
  "first_name" varchar(100) NOT NULL,
  "last_name" varchar(100) NOT NULL,
  "email" varchar(255) UNIQUE NOT NULL,
  "country" varchar(100),
  "phone_number" varchar(30) UNIQUE NOT NULL,
  "username" varchar(30) UNIQUE NOT NULL,
  "password_hash" varchar(255) NOT NULL,
  "role_id" integer NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "addresses" (
  "id" integer PRIMARY KEY,
  "street" varchar(255) NOT NULL,
  "postal_code" varchar(20) NOT NULL,
  "city" varchar(100) NOT NULL,
  "country" varchar(100) NOT NULL
);

CREATE TABLE "rentals" (
  "id" integer PRIMARY KEY,
  "title" varchar(200) NOT NULL,
  "description" text NOT NULL,
  "price_per_night" float NOT NULL,
  "max_guests" int NOT NULL,
  "owner_id" int NOT NULL,
  "address_id" int NOT NULL,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "rental_images" (
  "id" integer PRIMARY KEY,
  "rental_id" int NOT NULL,
  "image_url" varchar(500) NOT NULL,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "reservations" (
  "id" integer PRIMARY KEY,
  "rental_id" int NOT NULL,
  "tenant_id" int NOT NULL,
  "start_date" date NOT NULL,
  "end_date" date NOT NULL,
  "total_price" float NOT NULL,
  "created_at" timestamp DEFAULT (now())
);

ALTER TABLE "roles" ADD FOREIGN KEY ("id") REFERENCES "users" ("role_id");

ALTER TABLE "users" ADD FOREIGN KEY ("id") REFERENCES "rentals" ("owner_id");

ALTER TABLE "addresses" ADD FOREIGN KEY ("id") REFERENCES "rentals" ("address_id");

ALTER TABLE "rentals" ADD FOREIGN KEY ("id") REFERENCES "rental_images" ("rental_id");

ALTER TABLE "rentals" ADD FOREIGN KEY ("id") REFERENCES "reservations" ("rental_id");

ALTER TABLE "users" ADD FOREIGN KEY ("id") REFERENCES "reservations" ("tenant_id");
