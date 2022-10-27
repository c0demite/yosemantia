const textElement = document.getElementById('text')
const optionButtonsElement = document.getElementById('option-buttons')

let state = {}

function startGame() {
  state = {}
  showTextNode(1)
}

function showTextNode(textNodeIndex) {
  const textNode = textNodes.find(textNode => textNode.id === textNodeIndex)
  textElement.innerText = textNode.text
  while (optionButtonsElement.firstChild) {
    optionButtonsElement.removeChild(optionButtonsElement.firstChild)
  }

  textNode.options.forEach(option => {
    if (showOption(option)) {
      const button = document.createElement('button')
      button.innerText = option.text
      button.classList.add('nes-btn')
      button.addEventListener('click', () => selectOption(option))
      optionButtonsElement.appendChild(button)
    }
  })
}

function showOption(option) {
  return option.requiredState == null || option.requiredState(state)
}

function selectOption(option) {
  const nextTextNodeId = option.nextText
  if (nextTextNodeId <= 0) {
    return startGame()
  }
  state = Object.assign(state, option.setState)
  showTextNode(nextTextNodeId)
  onclick.pictureChange()
}


const textNodes = [
  {
    id: 1,
    text: 'Budzisz sie w dziwnym miejscu, jest ci zimno i jestes glodny, przed toba lezy sloik wypelniony niebieskim plynem',
    options: [
      {
        text: 'Wypijam niebieski plyn',
        nextText: 2
      },
      {
        text: 'Zabieram sloik ze soba',
        setState: { NiebieskiPlyn: true },
        nextText: 3
      },
      {
        text: 'Zostawiam sloik, po co mi to',
        nextText: 3
      }
    ]
  },
  {
    id: 2,
    text: 'Niebieski plyn okazal sie trucizna, umierasz 10 sekund po wypiciu.',
    options: [
      {
        text: 'Sprobuj ponownie',
        nextText: -1
      },
    ]
  },
  {
    id: 3,
    text: 'Po wstaniu i strzepaniu slomy w ktorej spales dostrzegasz handlarza, idziesz do niego zeby dowiedziec sie co to za miejsce',
    options: [
      {
        text: 'Spytaj handlarza co to za miejsce',
        nextText: 4
      },
      {
        text: 'Wymien niebieski plyn na jedzenie',
        requiredState: (currentState) => currentState.NiebieskiPlyn,
        setState: { NiebieskiPlyn: false, bulka: true },
        nextText: 5
      },
      {
        text: 'Zignoruj handlarza',
        nextText: 5
      }
    ]
  },
  {
    id: 4,
    text: 'Handlarz: ...',
    options: [
      {
        text: 'Daj handlarzowi sloik z niebieskim plynem',
        requiredState: (currentState) => currentState.NiebieskiPlyn,
        setState: { NiebieskiPlyn: false},
        nextText: 5
      },
      {
        text: 'odejdz',
        nextText: 5
      }
    ]
  },
  {
    id: 6,
    text: 'Odchodzisz i po chwili zaczynasz czuc zmeczenie',
    options: [
      {
        text: 'zjedz jedzenie ktore kupiles',
        requiredState: (currentState) => currentState.bulka,
        setState: { bulka: false},
        nextText: 5
      },
      {
        text: 'Wypijam niebieski plyn',
        requiredState: (currentState) => currentState.NiebieskiPlyn,
        nextText: 2
      },
      {
        text: 'idziesz do zamku za gorka',
        nextText: 5
      }
    ]
  },
  
]

startGame()