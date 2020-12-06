import * as dat from 'dat.gui'

const guiElement = document.createElement('div')
guiElement.setAttribute('id', 'gui')

document.body.appendChild(guiElement)

const gui = new dat.GUI({ autoPlace: false })
guiElement.append(gui.domElement)

export default gui
