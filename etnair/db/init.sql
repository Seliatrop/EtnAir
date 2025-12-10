CREATE TABLE "roles" (
  "id" integer PRIMARY KEY,
  "name" varchar(50) UNIQUE NOT NULL
);

CREATE TABLE "users" (
  "id" integer PRIMARY KEY,
  "first_name" varchar(100) NOT NULL,
  "last_name" varchar(100) NOT NULL,
  "email" varchar(255) UNIQUE NOT NULL,
  "phone" varchar(30) UNIQUE NOT NULL,
  "username" varchar(30) UNIQUE NOT NULL,
  "password_hash" varchar(255) NOT NULL,
  "profile_picture" varchar(500),
  "bio" text,
  "role_id" integer NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "user_verifications" (
  "id" integer PRIMARY KEY,
  "user_id" integer NOT NULL,
  "verified_email" boolean DEFAULT false,
  "verified_phone" boolean DEFAULT false,
  "verified_id" boolean DEFAULT false,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "sessions" (
  "id" integer PRIMARY KEY,
  "user_id" integer NOT NULL,
  "token" varchar(500) NOT NULL,
  "expires_at" timestamp NOT NULL,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "login_attempts" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "ip_address" varchar(100),
  "success" boolean,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "addresses" (
  "id" integer PRIMARY KEY,
  "street" varchar(255) NOT NULL,
  "city" varchar(100) NOT NULL,
  "postal_code" varchar(20) NOT NULL,
  "country" varchar(100) NOT NULL
);

CREATE TABLE "rentals" (
  "id" integer PRIMARY KEY,
  "owner_id" integer NOT NULL,
  "address_id" integer NOT NULL,
  "title" varchar(200) NOT NULL,
  "description" text NOT NULL,
  "price_per_night" numeric(10,2) NOT NULL,
  "cleaning_fee" numeric(10,2),
  "max_guests" integer NOT NULL,
  "rules" text,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "rental_images" (
  "id" integer PRIMARY KEY,
  "rental_id" integer NOT NULL,
  "image_url" varchar(500) NOT NULL,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "rental_calendar" (
  "id" integer PRIMARY KEY,
  "rental_id" integer NOT NULL,
  "date" date NOT NULL,
  "is_available" boolean DEFAULT true
);

CREATE TABLE "reservations" (
  "id" integer PRIMARY KEY,
  "rental_id" integer NOT NULL,
  "tenant_id" integer NOT NULL,
  "start_date" date NOT NULL,
  "end_date" date NOT NULL,
  "guests" integer DEFAULT 1,
  "total_price" numeric(10,2) NOT NULL,
  "status" varchar(50) DEFAULT 'pending',
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "payments" (
  "id" integer PRIMARY KEY,
  "reservation_id" integer NOT NULL,
  "amount" numeric(10,2) NOT NULL,
  "method" varchar(50),
  "status" varchar(50),
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "invoices" (
  "id" integer PRIMARY KEY,
  "reservation_id" integer NOT NULL,
  "pdf_url" varchar(500),
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "reviews" (
  "id" integer PRIMARY KEY,
  "rental_id" integer NOT NULL,
  "user_id" integer NOT NULL,
  "rating" integer NOT NULL,
  "comment" text,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "favorites" (
  "id" integer PRIMARY KEY,
  "user_id" integer NOT NULL,
  "rental_id" integer NOT NULL
);

CREATE TABLE "messages" (
  "id" integer PRIMARY KEY,
  "sender_id" integer NOT NULL,
  "receiver_id" integer NOT NULL,
  "rental_id" integer,
  "content" text NOT NULL,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "notifications" (
  "id" integer PRIMARY KEY,
  "user_id" integer NOT NULL,
  "content" text NOT NULL,
  "is_read" boolean DEFAULT false,
  "created_at" timestamp DEFAULT (now())
);

ALTER TABLE "users" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("id");

ALTER TABLE "user_verifications" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "sessions" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "login_attempts" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "rentals" ADD FOREIGN KEY ("owner_id") REFERENCES "users" ("id");

ALTER TABLE "rentals" ADD FOREIGN KEY ("address_id") REFERENCES "addresses" ("id");

ALTER TABLE "rental_images" ADD FOREIGN KEY ("rental_id") REFERENCES "rentals" ("id");

ALTER TABLE "rental_calendar" ADD FOREIGN KEY ("rental_id") REFERENCES "rentals" ("id");

ALTER TABLE "reservations" ADD FOREIGN KEY ("rental_id") REFERENCES "rentals" ("id");

ALTER TABLE "reservations" ADD FOREIGN KEY ("tenant_id") REFERENCES "users" ("id");

ALTER TABLE "payments" ADD FOREIGN KEY ("reservation_id") REFERENCES "reservations" ("id");

ALTER TABLE "invoices" ADD FOREIGN KEY ("reservation_id") REFERENCES "reservations" ("id");

ALTER TABLE "reviews" ADD FOREIGN KEY ("rental_id") REFERENCES "rentals" ("id");

ALTER TABLE "reviews" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "favorites" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "favorites" ADD FOREIGN KEY ("rental_id") REFERENCES "rentals" ("id");

ALTER TABLE "messages" ADD FOREIGN KEY ("sender_id") REFERENCES "users" ("id");

ALTER TABLE "messages" ADD FOREIGN KEY ("receiver_id") REFERENCES "users" ("id");

ALTER TABLE "messages" ADD FOREIGN KEY ("rental_id") REFERENCES "rentals" ("id");

ALTER TABLE "notifications" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
