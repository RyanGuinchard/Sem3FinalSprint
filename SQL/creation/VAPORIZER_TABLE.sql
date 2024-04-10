CREATE TABLE public.vaporizer
(
    id serial NOT NULL,
    class character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    type character varying NOT NULL,
    quantity character varying NOT NULL,
    strength character varying(255) NOT NULL,
    price character varying NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.vaporizer
    OWNER to postgres;
