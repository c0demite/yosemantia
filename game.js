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
        setState: { bezplynu: true },
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
        nextText: 6
      },
      {
        text: 'Zignoruj handlarza',
        requiredState: (currentState) => currentState.NiebieskiPlyn,
        nextText: 6
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
        requiredState: (currentState) => currentState.NiebieskiPlyn,
        nextText: 6
      },
      {
        text: 'odejdz',
        requiredState: (currentState) => currentState.bezplynu,
        nextText: 8
      }
    ]
  },
  {
    id: 5,
    text: 'Handlarz: Jak mozesz nie wiedziec gdzie jestes glupcze... Jestesmy w bridgewood wiosce biedakow ',
    options: [
      {
        text: 'odejdz',
        nextText: 6
      }
    ]
  },
  {
    id: 6,
    text: 'Odchodzisz i po chwili zaczynasz czuc zmeczenie',
    options: [
      {
        text: 'Wypij niebieski plyn',
        requiredState: (currentState) => currentState.NiebieskiPlyn,
        nextText: 2
      },
      {
        text: 'idz do zamku za gorka',
        nextText: 9
      },
      {
        text: 'przespij sie',
        nextText: 7
      }
    ]
  },
  {
    id: 7,
    text: 'Banda biedakow cie atakuje kiedy spisz, umierasz',
    options: [
      {
        text: 'Sprobuj ponownie',
        nextText: -1
      }
    ]
  },
  {
    id: 8,
    text: 'Handlarz cie napada, umierasz',
    options: [
      {
        text: 'Sprobuj ponownie',
        nextText: -1
      }
    ]
  },
  {
    id: 9,
    text: 'Wchodzisz do zamku',
    options: [
      {
        text: 'Przeszukaj zamek',
        nextText: 4
      },
      {
        text: 'Znajdz pokoj w ktorym sie przespisz',
        nextText: 10
      },
    ]
  },
  {
    id: 10,
    text: 'Burczy ci w brzuchu',
    options: [
      {
        text: 'Zjedz bulke ktora kupiles u handlarza',
        nextText: 11
      },
      {
        text: 'Wejdz do wielkiej komnaty',
        nextText: 12
      },

    ]
  },
  {
    id: 11,
    text: '',
    options: [

    ]
  },
]

startGame()