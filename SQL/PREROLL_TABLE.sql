CREATE TABLE public.preroll
(
    id serial NOT NULL,
    class character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    strength character varying(255) NOT NULL,
    price character varying NOT NULL,
    infused boolean NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.preroll
    OWNER to postgres;