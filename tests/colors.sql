create table colors(name text, red integer, green integer, blue integer);
insert into colors values('black',     0,   0,   0);
insert into colors values('red',     255,   0,   0);
insert into colors values('maroon',  128,   0,   0);
insert into colors values('lime',      0, 255,   0);
insert into colors values('green',     0, 128,   0);
insert into colors values('blue',      0,   0, 255);
insert into colors values('navy',      0,   0, 128);
insert into colors values('yellow',  255, 255,   0);
insert into colors values('fuchsia', 255,   0, 255);
insert into colors values('aqua',      0, 255, 255);
insert into colors values('white',   255, 255, 255);

.mode column

.headers off
select '## full table';
.headers on

select name, red, green, blue
from colors;

-- ## full table
-- name        red         green       blue
-- ----------  ----------  ----------  ----------
-- black       0           0           0
-- red         255         0           0
-- maroon      128         0           0
-- lime        0           255         0
-- green       0           128         0
-- blue        0           0           255
-- navy        0           0           128
-- yellow      255         255         0
-- fuchsia     255         0           255
-- aqua        0           255         255
-- white       255         255         255

.headers off
select '';
select '## left after filtering';
.headers on

select left.red as key,
       left.name as l_name,
       left.red as l_red,
       left.green as l_green,
       left.blue as l_blue
from colors as left
where (left.red != 0);

-- ## left after filtering
-- key         l_name      l_red       l_green     l_blue
-- ----------  ----------  ----------  ----------  ----------
-- 255         red         255         0           0
-- 128         maroon      128         0           0
-- 255         yellow      255         255         0
-- 255         fuchsia     255         0           255
-- 255         white       255         255         255

.headers off
select '';
select '## right after filtering';
.headers on

select right.green as key,
       right.name as r_name,
       right.red as r_red,
       right.green as r_green,
       right.blue as r_blue
from colors as right
where (right.green != 0);

-- ## right after filtering
-- key         r_name      r_red       r_green     r_blue
-- ----------  ----------  ----------  ----------  ----------
-- 255         lime        0           255         0
-- 128         green       0           128         0
-- 255         yellow      255         255         0
-- 255         aqua        0           255         255
-- 255         white       255         255         255

.headers off
select '';
select '## full inner join before filtering';
.headers on

select left.red as key,
       left.name as l_name,
       left.green as l_green,
       left.blue as l_blue,
       right.name as r_name,
       right.red as r_red,
       right.blue as r_blue
from colors as left inner join colors as right
on (left.red = right.green)
where (left.red != 0) and (right.green != 0);

-- ## full inner join before filtering
-- key         l_name      l_green     l_blue      r_name      r_red       r_blue
-- ----------  ----------  ----------  ----------  ----------  ----------  ----------
-- 255         red         0           0           aqua        0           255
-- 255         red         0           0           lime        0           0
-- 255         red         0           0           white       255         255
-- 255         red         0           0           yellow      255         0
-- 128         maroon      0           0           green       0           0
-- 255         yellow      255         0           aqua        0           255
-- 255         yellow      255         0           lime        0           0
-- 255         yellow      255         0           white       255         255
-- 255         yellow      255         0           yellow      255         0
-- 255         fuchsia     0           255         aqua        0           255
-- 255         fuchsia     0           255         lime        0           0
-- 255         fuchsia     0           255         white       255         255
-- 255         fuchsia     0           255         yellow      255         0
-- 255         white       255         255         aqua        0           255
-- 255         white       255         255         lime        0           0
-- 255         white       255         255         white       255         255
-- 255         white       255         255         yellow      255         0

.headers off
select '';
select '## inner join after filtering';
.headers on

select left.red as key,
       left.name as l_name,
       left.green as l_green,
       left.blue as l_blue,
       right.name as r_name,
       right.red as r_red,
       right.blue as r_blue
from colors as left inner join colors as right
on (left.red = right.green)
where (left.red != 0) and (right.green != 0) and (left.blue != 0) and (right.blue != 0);

-- ## inner join after filtering
-- key         l_name      l_green     l_blue      r_name      r_red       r_blue
-- ----------  ----------  ----------  ----------  ----------  ----------  ----------
-- 255         fuchsia     0           255         aqua        0           255
-- 255         fuchsia     0           255         white       255         255
-- 255         white       255         255         aqua        0           255
-- 255         white       255         255         white       255         255
