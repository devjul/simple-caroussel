(function() {
  'use strict';

  var content = false;
  var slider = false;
  var shortSlider = false;
  var slides = false;
  var nbSlides = 0;
  var prevSlide = false;
  var nextSlide = false;
  var currentSlide = 0;
  var clonePrev, cloneNext = false;
  var dots = new Array();
  var rotation = false;
  var rotationDelay = 45 * 1000;
  var durationEffect = 0.3 * 1000;
  var delayedEffect = false;

  // constant
  var translateHover = 8;

  function Slider(item) {
    content = item;
    this.init();

    return this;
  }

  Slider.prototype.init = function() {
    if (!content) {
      return;
    }

    slider = content.getElementsByClassName('slider')[0] || false;
    shortSlider = content.getElementsByClassName('shortSlider')[0] || false;
    if (!slider || !shortSlider) {
      return;
    }

    slides = content.getElementsByClassName('slide') || false;
    if (!slides) {
      return;
    }
    nbSlides = slides.length;

    this.addEvents();
  };

  Slider.prototype.addEvents = function() {
    this.setDimensions();
    this.placeShortcut();
    this.placePagination();
    this.cloneElements();
    this.autoRotation();
    this.translateSlide(0, 'direct');
  };

  Slider.prototype.setDimensions = function() {
    slider.style.width = nbSlides * 100 + '%';
    for (var i = 0; i < nbSlides; i++) {
      slides[i].style.width = 100 / nbSlides + '%';
    }
  };

  Slider.prototype.placeShortcut = function() {
    for (var i = 0; i < nbSlides; i++) {
      dots[i] = document.createElement('li');
      dots[i].setAttribute('data-id', i);
      if (i === 0) {
        dots[i].className = 'selected';
      }
      shortSlider.appendChild(dots[i]);
      dots[i].addEventListener('click', function(e) {
        currentSlide = parseInt(e.target.getAttribute('data-id'), 10);
        this.translateSlide(0, 'direct');
      }.bind(this));
    }
  };

  Slider.prototype.placePagination = function() {
    prevSlide = document.createElement('div');
    prevSlide.className = 'pagineSlide prevSlide';

    nextSlide = document.createElement('div');
    nextSlide.className = 'pagineSlide nextSlide';

    prevSlide.addEventListener('mouseover', function() {
      this.translateSlide(translateHover);
    }.bind(this));
    prevSlide.addEventListener('mouseout', function() {
      this.translateSlide(0);
    }.bind(this));
    prevSlide.addEventListener('click', function() {
      this.translateSlide(0, 'left');
    }.bind(this));

    nextSlide.addEventListener('mouseover', function() {
      this.translateSlide(-translateHover);
    }.bind(this));
    nextSlide.addEventListener('mouseout', function() {
      this.translateSlide(0);
    }.bind(this));
    nextSlide.addEventListener('click', function() {
      this.translateSlide(0, 'right');
    }.bind(this));

    content.appendChild(prevSlide);
    content.appendChild(nextSlide);
  };

  Slider.prototype.translateSlide = function(move, changeSlide) {
    window.clearInterval(rotation);
    if (changeSlide) {
      if (changeSlide === 'left') {
        currentSlide = --currentSlide;
      }
      else if (changeSlide === 'right') {
        currentSlide = ++currentSlide;
      }
    }

    slider.style.left = -((currentSlide + 1) * 100) + move + '%';
    if (changeSlide) {
      var needReposition = false;
      if (currentSlide >= nbSlides) {
        currentSlide = 0;
        needReposition = true;
      }
      if (currentSlide < 0) {
        currentSlide = nbSlides - 1;
        needReposition = true;
      }
      if (needReposition) {
        window.clearTimeout(delayedEffect);
        delayedEffect = setTimeout(function() {
          slider.classList.remove('transitionSlider');
          slider.style.left = -((currentSlide + 1) * 100) + move + '%';
          setTimeout(function() {
            slider.classList.add('transitionSlider');
          }, 10);
        }, durationEffect);
      }
      dots.forEach(function(item) {
        item.className = '';
      });
      dots[currentSlide].className = 'selected';
    }
    this.autoRotation();
  };

  Slider.prototype.cloneElements = function() {
    // clone first and last slides for animation
    var first = slides[0];
    var last = slides[nbSlides - 1];

    slider.style.width = (nbSlides + 2) * 100 + '%';
    var widthSlide = 100 / (nbSlides + 2) + '%';
    for (var i = 0; i < nbSlides; i++) {
      slides[i].style.width = widthSlide;
    }

    clonePrev = document.createElement('li');
    clonePrev.style.width = widthSlide;
    clonePrev.innerHTML = first.innerHTML;
    slider.appendChild(clonePrev);

    cloneNext = document.createElement('li');
    cloneNext.style.width = widthSlide;
    cloneNext.innerHTML = last.innerHTML;
    slider.insertBefore(cloneNext, slider.firstChild);
  };

  Slider.prototype.autoRotation = function() {
    rotation = setInterval(function() {
      this.translateSlide(0, 'right');
    }.bind(this), rotationDelay);
  };

  if (typeof(define) === 'function' && define.amd) {
    // AMD support
    define(function () {
      return Slider;
    });
  } 
  else if (typeof window === 'object') {
    // If no AMD and we are in the browser, attach to window
    window.Slider = Slider;
  }
})();