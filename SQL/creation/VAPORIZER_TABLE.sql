CREATE TABLE public.vaporizer
(
    id bigserial NOT NULL,
    class character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    size numeric NOT NULL,
    strength character varying(255) NOT NULL,
    disposable boolean NOT NULL,
    price character varying NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.vaporizer
    OWNER to postgres;
