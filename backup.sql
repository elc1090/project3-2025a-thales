--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bookmarks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookmarks (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    url text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" text NOT NULL
);


ALTER TABLE public.bookmarks OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: bookmarks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookmarks (id, title, description, url, "createdAt", "updatedAt", "userId") FROM stdin;
cmb35kgui0001ww9cfmlanzsx	peace	45 min background peaceful sound	https://www.youtube.com/watch?v=T1dV08Wervc&ab_channel=Ambient2K	2025-05-25 04:22:47.371	2025-05-25 04:23:45.918	cmb354a8l0000wwi07wv5ln1r
cmb35n1az0003ww9c32b38klh	lost	59 min background peaceful sound	https://www.youtube.com/watch?v=KeGDEnIbGV4&t=2929s&pp=0gcJCY0JAYcqIYzv	2025-05-25 04:24:47.196	2025-05-25 04:24:47.196	cmb354a8l0000wwi07wv5ln1r
cmb35thsz0005ww9cpex8tkug	Jogo do Tigrinho explicado com bananas	Vídeo explicativo de como funciona o jogo do tigrinho	https://www.youtube.com/watch?v=FdvN3XliXqo&ab_channel=OPrimoPrimata	2025-05-25 04:29:48.516	2025-05-25 04:29:48.516	cmb354aan0001wwi0r95wsowh
cmb3888wt0001wwvc3aj5tx5x	Integral Calculator	Calculate integrals online — with steps and graphing!	https://www.integral-calculator.com/	2025-05-25 05:37:16.061	2025-05-25 05:37:16.061	cmb354a8l0000wwi07wv5ln1r
cmb38a1sz0003wwvc72euzxj3	Conventional Commits	A specification for adding human and machine readable meaning to commit messages	https://www.conventionalcommits.org/en/v1.0.0/	2025-05-25 05:38:40.163	2025-05-25 05:42:20.504	cmb354acg0002wwi0ubcx06u4
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password) FROM stdin;
cmb354a8l0000wwi07wv5ln1r	João Silva	joao@email.com	$2b$10$1qv65ymRaGoeOmwS54x8deZoirlkeZVllLZo4ak8POvdKZv9Cp3..
cmb354aan0001wwi0r95wsowh	Maria Santos	maria@email.com	$2b$10$ZsG7kvZcmOeL1LD5BLgfE.LzUO5YU3aGAOJWRfJk7O94xBRM1xOIW
cmb354acg0002wwi0ubcx06u4	Pedro Costa	pedro@email.com	$2b$10$I1QnELWeOgmlxv3BOC8xAumQ0qZEp6OEOpavahedRRIKyZUcKDus6
cmb354aea0003wwi0rhdtk5rc	Ana Oliveira	ana@email.com	$2b$10$VJOw.pqYsj0bxGZWT6A2WORAmdkrq8LGSqkbUw8SsMyycidcTAG1S
\.


--
-- Name: bookmarks bookmarks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: bookmarks bookmarks_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT "bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

