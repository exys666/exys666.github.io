SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

ifeq ($(origin .RECIPEPREFIX), undefined)
  $(error This Make does not support .RECIPEPREFIX. Please use GNU Make 4.0 or later)
endif
.RECIPEPREFIX = >

SASSDIR=sass
TEMPSDIR=templates
OUTDIR=output

POSTSSRC=$(wildcard *.adoc)
POSTSOUT=$(patsubst %.adoc, $(OUTDIR)/%.html, $(POSTSSRC))

PAGESSRC=$(wildcard *.njk)
PAGESOUT=$(patsubst %.njk, $(OUTDIR)/%.html, $(PAGESSRC))

all :  $(OUTDIR) $(POSTSOUT) $(PAGESOUT) $(OUTDIR)/style.css $(OUTDIR)/posts.html $(OUTDIR)/.nojekyll $(OUTDIR)/CNAME
.PHONY: all

$(OUTDIR)/%.html : %.adoc $(TEMPSDIR)/*
> npm run post $< $@

$(OUTDIR)/%.html : %.njk $(TEMPSDIR)/*
> npm run page $< $@

$(OUTDIR)/posts.html : $(POSTSSRC)
> npm run posts $@ $(POSTSSRC)

$(OUTDIR)/style.css : $(SASSDIR)/*.sass
> npm run css $(SASSDIR)/main.sass $@

$(OUTDIR)/.nojekyll :
> touch $@

$(OUTDIR)/CNAME : CNAME 
> cp CNAME $@

$(OUTDIR) : 
> mkdir $(OUTDIR)

clean:
> rm -rf $(OUTDIR)
.PHONY: clean

