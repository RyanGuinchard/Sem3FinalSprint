CREATE TABLE public.edible
(
    id serial NOT NULL,
    class character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    type character varying NOT NULL,
    strength character varying(255) NOT NULL,
    quantity character varying NOT NULL,
    price character varying,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.edible
    OWNER to postgres;