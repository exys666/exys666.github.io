PAGES_SRC=$(wildcard *.njk)
PAGES=$(patsubst %.njk, target/%.html, $(PAGES_SRC))

POSTS_SRC=$(filter-out README.md, $(wildcard *.md))
POSTS=$(patsubst %.md, target/%.html, $(POSTS_SRC))

all :  target $(PAGES) $(POSTS) target/style.css target/posts.html target/CNAME target/.nojekyll
.PHONY: all

target/%.html : %.md
	npm run post $< $@

target/%.html : %.njk
	npm run page $< $@

target/style.css : src/sass/*.sass
	npm run css src/sass/main.sass $@

target/posts.html : $(POSTS_SRC)
	npm run posts ./ $@

target/CNAME : CNAME
	cp $< $@

target/.nojekyll :
	touch $@

target :
	mkdir target

clean:
	rm -rf target
.PHONY: clean