let textElement
let optionButtonsElement

let state = {}
let inventory = {}
let relationships = {}
let playerStats = {
  health: 100,
  knowledge: 0,
  reputation: 0
}

function initializeGame() {
  textElement = document.getElementById('text')
  optionButtonsElement = document.getElementById('option-buttons')
  startGame()
}

function startGame() {
  state = {}
  inventory = {}
  relationships = {
    garrett: 50,
    martha: 50,
    pip: 50
  }
  playerStats = {
    health: 100,
    knowledge: 0,
    reputation: 0
  }
  showTextNode(1)
}

function updateRelationship(character, change) {
  if (relationships[character] !== undefined) {
    relationships[character] = Math.max(0, Math.min(100, relationships[character] + change))
  }
}

function updatePlayerStats(stat, change) {
  if (playerStats[stat] !== undefined) {
    playerStats[stat] = Math.max(0, playerStats[stat] + change)
  }
}

function addToInventory(item) {
  inventory[item] = (inventory[item] || 0) + 1
}

function removeFromInventory(item) {
  if (inventory[item] && inventory[item] > 0) {
    inventory[item]--
    if (inventory[item] === 0) {
      delete inventory[item]
    }
    return true
  }
  return false
}

function hasInInventory(item) {
  return inventory[item] && inventory[item] > 0
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
  
  updateUI()
}

function showOption(option) {
  return option.requiredState == null || option.requiredState(state)
}

function selectOption(option) {
  const nextTextNodeId = option.nextText
  if (nextTextNodeId <= 0) {
    return startGame()
  }
  
  // Zarządzanie stanem
  state = Object.assign(state, option.setState)
  
  // Zarządzanie relacjami
  if (option.relationshipChange) {
    Object.keys(option.relationshipChange).forEach(character => {
      updateRelationship(character, option.relationshipChange[character])
    })
  }
  
  // Zarządzanie statystykami gracza
  if (option.statChange) {
    Object.keys(option.statChange).forEach(stat => {
      updatePlayerStats(stat, option.statChange[stat])
    })
  }
  
  // Zarządzanie inwentarzem
  if (option.addToInventory) {
    option.addToInventory.forEach(item => addToInventory(item))
  }
  
  if (option.removeFromInventory) {
    option.removeFromInventory.forEach(item => removeFromInventory(item))
  }
  
  showTextNode(nextTextNodeId)
  updateUI()
}


const textNodes = [
  {
    id: 1,
    text: 'Budzisz sie w dziwnym miejscu, jest ci zimno i jestes glodny, przed toba lezy sloik wypelniony niebieskim plynem',
    options: [
      {
        text: 'Wypij niebieski plyn',
        nextText: 2
      },
      {
        text: 'Zabierz sloik ze soba',
        setState: { NiebieskiPlyn: true },
        nextText: 3
      },
      {
        text: 'Zostaw sloik',
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
      },
      {
        text: 'Rozejrzyj się po wiosce',
        nextText: 16
      }
    ]
  },
  {
    id: 4,
    text: 'Handlarz Garrett Ironhand patrzy na ciebie podejrzliwie: "Hmm... Nie wyglądasz na miejscowego. Skąd masz ten niebieski płyn, obcy?"',
    options: [
      {
        text: 'Daj handlarzowi sloik z niebieskim plynem',
        requiredState: (currentState) => currentState.NiebieskiPlyn,
        setState: { NiebieskiPlyn: false},
        nextText: 5
      },
      {
        text: 'Odejdź bez odpowiedzi',
        requiredState: (currentState) => currentState.NiebieskiPlyn,
        nextText: 6
      },
      {
        text: 'Odejdź',
        requiredState: (currentState) => currentState.bezplynu,
        nextText: 8
      },
      {
        text: 'Zapytaj o wioskę',
        nextText: 101
      }
    ]
  },
  {
    id: 5,
    text: 'Garrett: "Heh, wiedziałem! To elixir Dominus... bardzo niebezpieczny. Dobrze, że mi go dałeś. Jesteśmy w Bridgewood, wiosce biedaków, jak mówią bogaci..."',
    options: [
      {
        text: 'Co wiesz o tym eliksirze?',
        nextText: 102
      },
      {
        text: 'Dlaczego tu zostałeś?',
        nextText: 103
      },
      {
        text: 'Odejdź',
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
        nextText: 12
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
        requiredState: (currentState) => currentState.bulka,
        nextText: 11
      },
      {
        text: 'Przeszukaj zamek',
        nextText: 12
      },
    ]
  },
  {
    id: 11,
    text: 'Zjadasz bulke i odzyskujesz sily. Czujesz sie lepiej i gotowy na dalsze przygody.',
    options: [
      {
        text: 'Przeszukaj zamek',
        nextText: 12
      },
      {
        text: 'Przespij sie w wygodnym lozku',
        nextText: 13
      }
    ]
  },
  {
    id: 12,
    text: 'Przeszukujac zamek znajdujesz skrzynke z zlotymi monetami i magiczny miecz. Jestes bogaty i potezny!',
    options: [
      {
        text: 'Wroc do wioski jako bohater',
        nextText: 14
      },
      {
        text: 'Wyrusz na dalsze przygody',
        nextText: 15
      }
    ]
  },
  {
    id: 13,
    text: 'Spisz spokojnie w zamku. Rano budzisz sie wypoczety i gotowy na nowe wyzwania.',
    options: [
      {
        text: 'Przeszukaj zamek',
        nextText: 12
      }
    ]
  },
  {
    id: 14,
    text: 'Wracasz do wioski jako bohater z magicznym mieczem i skarbem. Mieszkancy cie witaja z radoscia. Wygrales!',
    options: [
      {
        text: 'Zagraj ponownie',
        nextText: -1
      }
    ]
  },
  {
    id: 15,
    text: 'Wyruszasz w swiat na poszukiwanie nowych przygod. Kim wiesz, moze pewnego dnia stanie sie z ciebie legenda... Wygrales!',
    options: [
      {
        text: 'Zagraj ponownie',
        nextText: -1
      }
    ]
  },
  {
    id: 16,
    text: 'Rozglądasz się po wiosce Bridgewood. Widzisz zniszczone chaty, ale także kilku mieszkańców.',
    options: [
      {
        text: 'Podejdź do starej kobiety przy studni',
        nextText: 17
      },
      {
        text: 'Zagadaj dziecko bawiące się w błocie',
        nextText: 18
      },
      {
        text: 'Przeszukaj opuszczone domy',
        nextText: 19
      },
      {
        text: 'Wróć do handlarza',
        nextText: 4
      }
    ]
  },
  {
    id: 17,
    text: 'Stara kobieta Martha: "Ach, obcy... Dawno nikogo tu nie widziałam. Ta wioska była kiedyś piękna..."',
    options: [
      {
        text: 'Opowiedz mi o przeszłości wioski',
        nextText: 20
      },
      {
        text: 'Co się stało z mieszkańcami?',
        nextText: 21
      },
      {
        text: 'Gdzie mogę znaleźć jedzenie?',
        nextText: 22
      },
      {
        text: 'Żegnaj',
        nextText: 16
      }
    ]
  },
  {
    id: 18,
    text: 'Dziecko o imieniu Pip patrzy na ciebie wielkimi oczami: "Pan nie jest stąd, prawda? Mama mówiła żeby uważać na obcych..."',
    options: [
      {
        text: 'Gdzie jest twoja mama?',
        nextText: 23
      },
      {
        text: 'Czy znasz jakieś ciekawe miejsca?',
        nextText: 24
      },
      {
        text: 'Masz coś do jedzenia?',
        requiredState: (currentState) => !currentState.bulka,
        nextText: 25
      },
      {
        text: 'Miło było cię poznać',
        nextText: 16
      }
    ]
  },
  {
    id: 19,
    text: 'W opuszczonych domach znajdujesz stare meble i szczątki dawnego życia. Wszystko pokrywa kurz.',
    options: [
      {
        text: 'Przeszukaj dokładniej',
        nextText: 26
      },
      {
        text: 'Sprawdź piwnicę',
        nextText: 27
      },
      {
        text: 'Wyjdź z domów',
        nextText: 16
      }
    ]
  },
  {
    id: 20,
    text: 'Martha: "Bridgewood słynęło z najlepszych alchemików w królestwie. Ale lord Yosemantia eksperymentował z czymś zakazanym... Ten niebieski płyn to jego dzieło."',
    options: [
      {
        text: 'Co to był za eksperyment?',
        setState: { wiedza_o_lordzie: true },
        nextText: 28
      },
      {
        text: 'Co się stało z lordem?',
        nextText: 29
      },
      {
        text: 'Czy można to naprawić?',
        nextText: 30
      },
      {
        text: 'Dziękuję za opowieść',
        nextText: 17
      }
    ]
  },
  {
    id: 21,
    text: 'Martha: "Większość uciekła gdy zaczęły się dziwne rzeczy. Potwory w nocy, nieznane choroby... Zostaliśmy tylko my, najbiedniejsi."',
    options: [
      {
        text: 'Jakie dziwne rzeczy?',
        nextText: 31
      },
      {
        text: 'Dlaczego nie uciekliście?',
        nextText: 32
      },
      {
        text: 'Może mogę pomóc?',
        setState: { obietnica_pomocy: true },
        nextText: 33
      },
      {
        text: 'Rozumiem...',
        nextText: 17
      }
    ]
  },
  {
    id: 22,
    text: 'Martha: "Mam trochę chleba, ale... mogłbyś mi pomóc w zamian? Mój stary koś złamał się i nie mogę zebrać ziarna."',
    options: [
      {
        text: 'Oczywiście, naprawię koś',
        setState: { zadanie_kos: true },
        nextText: 34
      },
      {
        text: 'Nie mam czasu',
        nextText: 17
      },
      {
        text: 'Co jeszcze chcesz w zamian?',
        nextText: 35
      }
    ]
  },
  {
    id: 23,
    text: 'Pip: "Mama poszła do lasu szukać ziół... ale to było trzy dni temu... Boję się, że coś jej się stało."',
    options: [
      {
        text: 'Pokażesz mi drogę do lasu?',
        setState: { lokalizacja_lasu: true },
        nextText: 36
      },
      {
        text: 'Zostań tu, znajdę ją',
        setState: { misja_elena: true },
        nextText: 37
      },
      {
        text: 'Może wróciła już do domu?',
        nextText: 38
      },
      {
        text: 'Przykro mi...',
        nextText: 18
      }
    ]
  },
  {
    id: 24,
    text: 'Pip: "Jest taka jaskinia za lasem! Mama mówiła żeby tam nie chodzić, bo mieszkają tam dziwne światła... Ale może tam są skarby!"',
    options: [
      {
        text: 'Pokaż mi tę jaskinię',
        setState: { lokalizacja_jaskini: true },
        nextText: 39
      },
      {
        text: 'Dlaczego nie wolno tam chodzić?',
        nextText: 40
      },
      {
        text: 'Znasz inne miejsca?',
        nextText: 41
      },
      {
        text: 'Lepiej tam nie chodźmy',
        nextText: 18
      }
    ]
  },
  {
    id: 25,
    text: 'Pip: "Jestem głodne... ale mamy tylko trochę zupy z wody i liści... Mama robiła lepszą, ale jej nie ma."',
    options: [
      {
        text: 'Daj mi trochę zupy',
        setState: { wodnista_zupa: true },
        nextText: 42
      },
      {
        text: 'Może masz coś lepszego?',
        nextText: 43
      },
      {
        text: 'Znajdę ci prawdziwe jedzenie',
        setState: { obietnica_jedzenie: true },
        nextText: 44
      },
      {
        text: 'Przykro mi',
        nextText: 18
      }
    ]
  },
  {
    id: 26,
    text: 'Pod starą deską znajdujesz małą sakiewkę z kilkoma monetami i dziwny amulet z niebieskim kamieniem.',
    options: [
      {
        text: 'Weź monety i amulet',
        setState: { monety: true, stary_amulet: true },
        addToInventory: ['monety', 'stary_amulet'],
        statChange: { knowledge: 5 },
        nextText: 45
      },
      {
        text: 'Weź tylko monety',
        setState: { monety: true },
        addToInventory: ['monety'],
        nextText: 46
      },
      {
        text: 'Zostaw wszystko',
        nextText: 19
      }
    ]
  },
  {
    id: 27,
    text: 'W ciemnej piwnicy widzisz stare beczki i... coś się porusza w kącie! To wielki szczur z czerwonymi oczami.',
    options: [
      {
        text: 'Zbadaj szczura',
        nextText: 47
      },
      {
        text: 'Przeszukaj beczki',
        nextText: 48
      },
      {
        text: 'Uciekaj z piwnicy',
        nextText: 19
      }
    ]
  },
  {
    id: 28,
    text: 'Martha: "Próbował stworzyć eliksir nieśmiertelności... ale zamiast tego uwolnił coś strasznego. Cienie zaczęły żyć własnym życiem."',
    options: [
      {
        text: 'Co uwolnił dokładnie?',
        nextText: 49
      },
      {
        text: 'Gdzie jest ten eliksir?',
        nextText: 50
      },
      {
        text: 'Można to cofnąć?',
        nextText: 51
      },
      {
        text: 'Rozumiem...',
        nextText: 20
      }
    ]
  },
  {
    id: 29,
    text: 'Martha: "Lord Yosemantia? Nikt go nie widział od lat... Mówią że uwięził sam siebie w wieży zamku, bojąc się własnych eksperymentów."',
    options: [
      {
        text: 'Może powinienem go odwiedzić',
        nextText: 52
      },
      {
        text: 'Czy żyje jeszcze?',
        nextText: 53
      },
      {
        text: 'Co robi w tej wieży?',
        nextText: 54
      },
      {
        text: 'Wracam do poprzedniego tematu',
        nextText: 20
      }
    ]
  },
  {
    id: 30,
    text: 'Martha: "Może... Stary Sage Willowbark w lesie zna starożytne zaklęcia. Ale trzeba go najpierw znaleźć."',
    options: [
      {
        text: 'Gdzie mieszka ten mędrzec?',
        setState: { lokalizacja_medrca: true },
        nextText: 55
      },
      {
        text: 'Co to za zaklęcia?',
        nextText: 56
      },
      {
        text: 'Znajdę go',
        setState: { misja_medrzec: true },
        nextText: 57
      },
      {
        text: 'Może jest inny sposób',
        nextText: 20
      }
    ]
  },
  {
    id: 31,
    text: 'Martha: "Cienie poruszały się jak żywe... rośliny usychały w ciągu nocy... a niektórzy ludzie zaczęli mówić do siebie."',
    options: [
      {
        text: 'Czy to wciąż się dzieje?',
        nextText: 58
      },
      {
        text: 'Kto mówił do siebie?',
        nextText: 59
      },
      {
        text: 'Wrócę do tego tematu',
        nextText: 21
      }
    ]
  },
  {
    id: 32,
    text: 'Martha: "Gdzie mieliśmy iść? Nie mamy pieniędzy, nie mamy krewnych w innych miastach... To nasze życie, nasze domy."',
    options: [
      {
        text: 'Rozumiem, to musi być trudne',
        nextText: 60
      },
      {
        text: 'Mogę wam pomóc uciec',
        nextText: 61
      },
      {
        text: 'Może da się naprawić wioskę',
        nextText: 62
      },
      {
        text: 'Wracam do poprzedniego tematu',
        nextText: 21
      }
    ]
  },
  {
    id: 33,
    text: 'Martha: "Naprawdę? To bardzo miłe... Jeśli znajdziesz coś cennego w zamku, może pomogłoby nam odbudować wioskę."',
    options: [
      {
        text: 'Postaram się znaleźć coś wartościowego',
        setState: { misja_skarb_dla_wioski: true },
        nextText: 63
      },
      {
        text: 'Co dokładnie potrzebujecie?',
        nextText: 64
      },
      {
        text: 'Nie mogę niczego obiecać',
        nextText: 21
      }
    ]
  },
  {
    id: 34,
    text: 'Martha pokazuje ci złamany koś. Potrzebujesz kawałka metalu do naprawy.',
    options: [
      {
        text: 'Poszukam metalu w domach',
        nextText: 65
      },
      {
        text: 'Może handlarz ma coś odpowiedniego',
        nextText: 66
      },
      {
        text: 'Sprawdzę w zamku',
        nextText: 67
      },
      {
        text: 'Przykro mi, nie mogę pomóc',
        setState: { zadanie_kos: false },
        nextText: 22
      }
    ]
  },
  {
    id: 35,
    text: 'Martha: "Informacje... Jeśli dowiesz się co się stało z naszym burmistrzem, powiem ci gdzie ukryłam rodzinne kosztowności."',
    options: [
      {
        text: 'Opowiedz o burmistrzu',
        nextText: 68
      },
      {
        text: 'Znajdę go',
        setState: { misja_burmistrz: true },
        nextText: 69
      },
      {
        text: 'Nie jestem zainteresowany',
        nextText: 22
      }
    ]
  },
  {
    id: 36,
    text: 'Pip: "Las jest za wzgórzem! Ale mama mówiła, żeby nie chodzić tam samemu... Może pójdę z panem?"',
    options: [
      {
        text: 'Dobrze, pójdziemy razem',
        setState: { pip_companion: true },
        nextText: 70
      },
      {
        text: 'Nie, zostań tutaj gdzie jest bezpiecznie',
        nextText: 71
      },
      {
        text: 'Pokażesz mi tylko drogę',
        nextText: 72
      }
    ]
  },
  {
    id: 37,
    text: 'Pip: "Naprawdę? Znajdzie pan mamę? Elena to jej imię... Zna się na ziołach lepiej niż ktokolwiek!"',
    options: [
      {
        text: 'Postaram się ją znaleźć',
        nextText: 73
      },
      {
        text: 'Opowiedz mi więcej o mamie',
        nextText: 74
      },
      {
        text: 'Jak długo jej nie ma?',
        nextText: 75
      }
    ]
  },
  {
    id: 38,
    text: 'Pip: "Nie... sprawdzałem wszędzie. Może te złe rzeczy z lasu ją wzięły?"',
    options: [
      {
        text: 'Jakie złe rzeczy?',
        nextText: 76
      },
      {
        text: 'Sprawdzę las',
        setState: { misja_elena: true },
        nextText: 77
      },
      {
        text: 'Nie trać nadziei',
        nextText: 78
      }
    ]
  },
  {
    id: 39,
    text: 'Pip: "To niedaleko! Ale... obiecaj mi, że uważasz. Czasem słychać stamtąd dziwne dźwięki."',
    options: [
      {
        text: 'Obiecuję, będę ostrożny',
        nextText: 79
      },
      {
        text: 'Jakie dźwięki?',
        nextText: 80
      },
      {
        text: 'Może lepiej nie iść',
        setState: { lokalizacja_jaskini: false },
        nextText: 24
      }
    ]
  },
  {
    id: 40,
    text: 'Pip: "Mama mówiła, że tam mieszkają duchy starych górników... Wydobywali tam magiczne kamienie dla lorda."',
    options: [
      {
        text: 'Magiczne kamienie?',
        nextText: 81
      },
      {
        text: 'Co się stało z górnikami?',
        nextText: 82
      },
      {
        text: 'Może tam są skarby',
        nextText: 83
      },
      {
        text: 'Brzmi niebezpiecznie',
        nextText: 24
      }
    ]
  },
  {
    id: 41,
    text: 'Pip: "Jest jeszcze stara świątynia na wzgórzu! Ale tam chodzą tylko kapłani w białych szatach..."',
    options: [
      {
        text: 'Opowiedz o świątyni',
        setState: { lokalizacja_swiatyni: true },
        nextText: 84
      },
      {
        text: 'Jakie kapłani?',
        nextText: 85
      },
      {
        text: 'Czy są przyjaźni?',
        nextText: 86
      },
      {
        text: 'Dziękuję za informacje',
        nextText: 24
      }
    ]
  },
  {
    id: 42,
    text: 'Pip daje ci miskę wodnistej zupy. Jest ciepła, ale prawie bez smaku. Czujesz się trochę lepiej.',
    options: [
      {
        text: 'Dziękuję, to pomaga',
        nextText: 87
      },
      {
        text: 'Czy masz więcej?',
        nextText: 88
      },
      {
        text: 'Znajdę ci lepsze jedzenie',
        setState: { obietnica_jedzenie: true },
        nextText: 89
      }
    ]
  },
  {
    id: 43,
    text: 'Pip: "Nie... to wszystko co mamy. Handlarz czasem daje nam czerstwy chleb, ale chce za to pieniędzy."',
    options: [
      {
        text: 'Mam trochę pieniędzy',
        requiredState: (currentState) => currentState.monety,
        setState: { monety: false, pomoc_pip: true },
        nextText: 90
      },
      {
        text: 'Porozmawiam z handlarzem',
        nextText: 91
      },
      {
        text: 'Znajdę inne rozwiązanie',
        nextText: 25
      }
    ]
  },
  {
    id: 44,
    text: 'Pip: "Naprawdę? To byłoby wspaniałe! Może wtedy mama wróci szybciej, gdy poczuje zapach prawdziwego jedzenia."',
    options: [
      {
        text: 'Postaram się',
        nextText: 92
      },
      {
        text: 'Może jej zapach ją przyprowadzi',
        nextText: 93
      },
      {
        text: 'Wracam do tego tematu',
        nextText: 25
      }
    ]
  },
  {
    id: 45,
    text: 'Monety dzwonią w twojej kieszeni, a amulet emanuje słabym, błękitnym światłem. Może ma jakieś magiczne właściwości?',
    options: [
      {
        text: 'Zbadaj amulet dokładniej',
        nextText: 94
      },
      {
        text: 'Schowaj go bezpiecznie',
        nextText: 95
      },
      {
        text: 'Wróć do przeszukiwania',
        nextText: 19
      }
    ]
  },
  {
    id: 46,
    text: 'Monety to zawsze przydatne znalezisko. Zostawiasz amulet - kto wie, może ma jakąś klątwę.',
    options: [
      {
        text: 'Może jednak wezmę amulet',
        setState: { stary_amulet: true },
        nextText: 96
      },
      {
        text: 'Kontynuuj przeszukiwanie',
        nextText: 19
      }
    ]
  },
  {
    id: 47,
    text: 'Szczur patrzy na ciebie inteligentnie. Ma coś błyszczącego w pysku - wygląda na mały klucz!',
    options: [
      {
        text: 'Spróbuj wziąć klucz',
        nextText: 97
      },
      {
        text: 'Daj szczurowi coś do jedzenia',
        requiredState: (currentState) => currentState.bulka || currentState.wodnista_zupa,
        nextText: 98
      },
      {
        text: 'Zostaw szczura w spokoju',
        nextText: 27
      }
    ]
  },
  {
    id: 48,
    text: 'W beczce znajdujesz stary przewód alchemiczny i kilka pustych fiolek. Ktoś tu prowadził eksperymenty.',
    options: [
      {
        text: 'Weź sprzęt alchemiczny',
        setState: { sprzet_alchemiczny: true },
        nextText: 99
      },
      {
        text: 'Zostaw to wszystko',
        nextText: 27
      },
      {
        text: 'Zbadaj dokładniej',
        nextText: 100
      }
    ]
  },
  {
    id: 101,
    text: 'Garrett: "Bridgewood? Kiedyś był to najlepszy ośrodek alchemiczny w królestwie. Ale to wszystko skończyło się przez głupotę lorda Yosemantii..."',
    options: [
      {
        text: 'Opowiedz więcej o lordzie',
        nextText: 104
      },
      {
        text: 'Co się tutaj stało?',
        nextText: 105
      },
      {
        text: 'Czy możesz mi coś sprzedać?',
        nextText: 106
      },
      {
        text: 'Dziękuję za informacje',
        nextText: 4
      }
    ]
  },
  {
    id: 102,
    text: 'Garrett: "Elixir Dominus... miał dawać nieśmiertelność. Ale zamiast tego otwiera portal do Ciemnej Sfery. Bardzo niebezpieczne gówno, przepraszam za język."',
    options: [
      {
        text: 'Co to jest Ciemna Sfera?',
        nextText: 107
      },
      {
        text: 'Jak znasz te nazwy?',
        nextText: 108
      },
      {
        text: 'Czy jest na to antidotum?',
        nextText: 109
      },
      {
        text: 'Rozumiem...',
        nextText: 5
      }
    ]
  },
  {
    id: 103,
    text: 'Garrett: "Ktoś musi pilnować, żeby nikt nie odkrył starych laboratoriów... A poza tym, to mój dom. Urodzony i wychowany w Bridgewood."',
    options: [
      {
        text: 'Jakie laboratoria?',
        nextText: 110
      },
      {
        text: 'Nie czujesz się samotny?',
        relationshipChange: { garrett: 5 },
        nextText: 111
      },
      {
        text: 'Czy możesz mi pomóc?',
        nextText: 112
      },
      {
        text: 'Szanuję twoją lojalność',
        setState: { garrett_respect: true },
        relationshipChange: { garrett: 10 },
        statChange: { reputation: 5 },
        nextText: 5
      }
    ]
  },
  {
    id: 104,
    text: 'Garrett: "Aldric von Yosemantia... był moim mistrzem, zanim oszalał. Genialny alchemik, ale zbyt ambitny. Chciał pokonać samą śmierć."',
    options: [
      {
        text: 'Byłeś jego uczniem?',
        setState: { garrett_backstory: true },
        nextText: 113
      },
      {
        text: 'Co sprawiło, że oszalał?',
        nextText: 114
      },
      {
        text: 'Gdzie jest teraz?',
        nextText: 115
      },
      {
        text: 'Wracam do poprzedniego tematu',
        nextText: 101
      }
    ]
  },
  {
    id: 105,
    text: 'Garrett: "Eksperymenty... coś poszło nie tak i uwolnione zostały siły, których nie rozumiemy. Ludzie zaczęli znikać, zwierzęta mutować..."',
    options: [
      {
        text: 'Jakie siły?',
        nextText: 116
      },
      {
        text: 'Czy można to naprawić?',
        nextText: 117
      },
      {
        text: 'Co z pozostałymi mieszkańcami?',
        nextText: 118
      },
      {
        text: 'To brzmi przerażająco',
        nextText: 101
      }
    ]
  },
  {
    id: 106,
    text: 'Garrett: "Hah! Zależnie od tego co masz... Może wymienię ci podstawowe zapasy na coś przydatnego."',
    options: [
      {
        text: 'Mam monety',
        requiredState: (currentState) => currentState.monety,
        nextText: 119
      },
      {
        text: 'Mam stary amulet',
        requiredState: (currentState) => currentState.stary_amulet,
        nextText: 120
      },
      {
        text: 'Co potrzebujesz?',
        nextText: 121
      },
      {
        text: 'Nie mam nic cennego',
        nextText: 4
      }
    ]
  },
  {
    id: 107,
    text: 'Garrett: "Ciemna Sfera to... piekło alchemików. Miejsce gdzie żyją demony i cienie. Lord przypadkiem otworzył drogę dla tych potworów."',
    options: [
      {
        text: 'Czy demony wciąż tutaj są?',
        nextText: 122
      },
      {
        text: 'Jak można zamknąć portal?',
        nextText: 123
      },
      {
        text: 'To brzmi jak koniec świata',
        nextText: 102
      }
    ]
  },
  {
    id: 108,
    text: 'Garrett: "Byłem jego asystentem przez dwadzieścia lat... Znam każdy eliksir, każdy składnik. To była moja życiowa pasja, zanim wszystko się posypało."',
    options: [
      {
        text: 'Możesz mnie nauczyć alchemii?',
        setState: { garrett_teacher: true },
        nextText: 124
      },
      {
        text: 'Żałujesz tamtych czasów?',
        nextText: 125
      },
      {
        text: 'Dlaczego nie kontynuujesz?',
        nextText: 126
      },
      {
        text: 'Wracam do tematu',
        nextText: 102
      }
    ]
  },
  {
    id: 109,
    text: 'Garrett: "Antidotum... teoretycznie tak. Potrzeba Kwiatu Światła z Świątyni Słońca i krwi dobrowolnej ofiary. Ale to tylko teoria..."',
    options: [
      {
        text: 'Gdzie jest Świątynia Słońca?',
        setState: { lokalizacja_swiatyni: true, wiedza_antidotum: true },
        nextText: 127
      },
      {
        text: 'Co znaczy dobrowolna ofiara?',
        nextText: 128
      },
      {
        text: 'Tylko teoria?',
        nextText: 129
      },
      {
        text: 'Znajdę te składniki',
        setState: { misja_antidotum: true },
        nextText: 130
      }
    ]
  },
  {
    id: 110,
    text: 'Garrett: "Pod zamkiem są tunele... stare laboratoria gdzie lord prowadził swoje eksperymenty. Niebezpieczne miejsce, pełne pułapek i... gorszych rzeczy."',
    options: [
      {
        text: 'Czy możesz mnie tam zaprowadzić?',
        nextText: 131
      },
      {
        text: 'Co tam zostało?',
        nextText: 132
      },
      {
        text: 'Jakie gorsze rzeczy?',
        nextText: 133
      },
      {
        text: 'Może lepiej tam nie chodzić',
        nextText: 103
      }
    ]
  }
]

function updateUI() {
  // Aktualizacja statystyk
  document.getElementById('health-stat').textContent = playerStats.health
  document.getElementById('knowledge-stat').textContent = playerStats.knowledge
  document.getElementById('reputation-stat').textContent = playerStats.reputation
  
  // Aktualizacja inwentarza
  const inventoryList = document.getElementById('inventory-list')
  inventoryList.innerHTML = ''
  
  Object.keys(inventory).forEach(item => {
    if (inventory[item] > 0) {
      const itemDiv = document.createElement('div')
      itemDiv.classList.add('inventory-item')
      itemDiv.textContent = `${item} (${inventory[item]})`
      inventoryList.appendChild(itemDiv)
    }
  })
  
  if (Object.keys(inventory).length === 0) {
    inventoryList.textContent = 'Pusty'
  }
}

// Inicjalizacja gry po załadowaniu strony
document.addEventListener('DOMContentLoaded', function() {
  initializeGame()
})