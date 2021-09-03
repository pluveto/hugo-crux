function toggleExpand(who) {
    var next = who.nextElementSibling
    console.log(next.style.display)
    next.style.display = next.style.display == 'block' ? 'none' : 'block'
    next.classList.toggle('show')
    console.log(next.style.display)
    who.querySelector(".icon").classList.toggle('bx-rotate-90')
}


