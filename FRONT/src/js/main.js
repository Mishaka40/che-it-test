
function accordion(options){
  let opts = {
    globalContainer: '.accordion-container',
    containerSelector: '.accordion',
    btnSelector: '.accordion__head',
    dropdownSelector: '.accordion__body',
  }

  opts = { ...opts, ...options }

  function onTransitionEnd() {
    // Clean up styles (for adaptation)
    if(this.style.height === '0px') {
      this.style.height = ''
    } else {
      this.style.height = 'auto'
    }
    this.removeEventListener('transitionend', onTransitionEnd)
  }
  function clickToggle() {
    let thisContainer = this.closest(opts.containerSelector)
    let thisContent = thisContainer.querySelector(opts.dropdownSelector)
    let accordionsContainer = opts.globalContainer ? thisContainer.closest(opts.globalContainer) : false
    let allAccordions = accordionsContainer ? Array.from(accordionsContainer.querySelectorAll('.is-open')) : []

    // Close other accordions
    if(allAccordions.length) {
      allAccordions = allAccordions.filter(item => item !== thisContainer)
      allAccordions.forEach(item => item.classList.remove('is-open'))
      allAccordions.forEach(function (item) {
        item = item.querySelector(opts.dropdownSelector)

        if(!item){
          return;
        }

        item.style.height = item.offsetHeight + 'px'
        setTimeout(function () {
          item.style.height = '0px'
        }, 1)
        item.addEventListener('transitionend', onTransitionEnd)
      })
    }

    // Toggle current accordion
    if(!thisContainer.classList.contains('is-open')){
      thisContent.style.height = thisContent.scrollHeight + 'px'
    } else {
      thisContent.style.height = thisContent.offsetHeight + 'px'
      setTimeout(function () {
        thisContent.style.height = '0px'
      }, 1)
    }

    thisContainer.classList.toggle('is-open');
    thisContent.addEventListener('transitionend', onTransitionEnd)
  }

  // Default open accordions
  document.querySelectorAll(opts.containerSelector+'.is-open').forEach(function (item) {
    let thisContent = item.querySelector(opts.dropdownSelector)
    if(thisContent){
      thisContent.style.height = thisContent.scrollHeight + 'px'
    }
  })
  dynamicListener('click', opts.containerSelector + ' ' + opts.btnSelector, clickToggle)
}

function dynamicListener(events, selector, handler, context){
  events.split(' ').forEach(function (event) {
    (document || context).addEventListener(event, function (e) {
      if(e.target.matches(selector) || e.target.closest(selector)){
        handler.call(e.target.closest(selector), e);
      }
    })
  })
}

// Connect all sections
let sectionsJS = {};
function sectionJS(selector = '', callback){
  if(!selector || typeof callback !== 'function'){
    return;
  }
  sectionsJS[selector] = callback;
}

function blocks() {
  let commonSections = {
    '.header': function (header) {
      header = header[0]
      let burger = header.querySelector('.header__burger')
      let menu = document.querySelector('.menu')
      let body = document.querySelector('.page__body')

      burger.addEventListener('click', function (){
        burger.classList.toggle('is-open')
        menu.classList.toggle('is-open')
        body.classList.toggle('menu-open')
      })
      accordion({
        globalContainer: '.menu__list',
        containerSelector: '.has-child',
        btnSelector: ' > a',
        dropdownSelector: '.has-child > ul',
      })

    },
  };
  let allSections = {
    ...commonSections,
    ...sectionsJS
  }

  Object.keys(allSections).forEach(selector => {
    if (document.querySelector(selector)) {
      allSections[selector](document.querySelectorAll(selector));
    }
  })
}

document.addEventListener('DOMContentLoaded', function () {
  blocks();

  if(typeof Fancybox !== 'undefined') {
    Fancybox.bind('[data-fancybox]', {
      dragToClose: false
    })
    // Fancybox.show([{
    //   src: '#modal_error',
    //   type: 'inline',
    //   placeFocusBack: false,
    //   trapFocus: false,
    //   autoFocus: false,
    // }], {
    //   dragToClose: false,
    //   on: {
    //     "destroy": (event, fancybox, slide) => {
    //       clearTimeout(closeTimeout)
    //
    //       if(activePopup){
    //         openPopup(false, activePopup)
    //       }
    //     },
    //   }
    // })
  }
})