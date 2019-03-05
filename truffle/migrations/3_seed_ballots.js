const { createBallot } = require('../lib')

module.exports = async function(_0, _1, accounts) {
  const Voting = artifacts.require('Voting')
  const voting = await Voting.deployed()

  const [creator, voter1, voter2, voter3, voter4, voter5, voter6] = accounts
  const voters = [creator, voter1, voter2, voter3, voter4, voter5, voter6]

  const ballots = [
    {
      name: 'Wybory parlamentarne 2015r',
      voters,
      proposals: [
        ['Prawo i Sprawiedliwość'],
        ['Platforma Obywatelska RP', voter3],
        ['Partia Razem'],
        ['KORWiN', voter1, voter2],
        ['Polskie Stronnictwo Ludowe'],
        ['KKW Zjednoczona Lewica SLD+TR+PPS+UP+Zieloni'],
        ['KWW „Kukiz’15”', voter4, voter5],
        ['Nowoczesna Ryszarda Petru'],
      ],
    },
    {
      name: 'Wybory prezydenckie 2015r',
      voters,
      proposals: [
        ['Grzegorz Michał Braun', voter1, voter5],
        ['Andrzej Sebastian Duda'],
        ['Adam Sebastian Jarubas'],
        ['Bronisław Maria Komorowski'],
        ['Janusz Ryszard Korwin-Mikke', voter2, voter3, voter4],
        ['Marian Janusz Kowalski'],
        ['Paweł Piotr Kukiz'],
        ['Magdalena Agnieszka Ogórek'],
        ['Janusz Marian Palikot'],
        ['Paweł Jan Tanajno'],
        ['Jacek Wilk'],
      ],
    },
    {
      name: 'Wybory do Parlamentu EU 2014',
      voters,
      proposals: [
        ['Koalicyjny KW Europa Plus Twój Ruch'],
        ['Koalicyjny KW Sojusz Lewicy Demokratycznej – Unia Pracy'],
        ['KW Nowa Prawica – Janusza Korwin-Mikke'],
        ['KW Platforma Obywatelska RP'],
        ['KW Polska Razem Jarosława Gowina'],
        ['KW Polskie Stronnictwo Ludowe'],
        ['KW Prawo i Sprawiedliwość'],
        ['KW Solidarna Polska Zbigniewa Ziobro'],
        ['KW Wyborców Ruch Narodowy'],
      ],
    },
    {
      name: 'Konkurs Piosenki Eurowizji 2014',
      voters,
      proposals: [
        ['Ukraina'],
        ['Białoruś'],
        ['Azerbejdżan'],
        ['Islandia'],
        ['Norwegia'],
        ['Rumunia'],
        ['Armenia'],
        ['Czarnogóra'],
        ['Polska', voter1],
        ['Grecja'],
        ['Austria'],
        ['Niemcy', voter3, voter4, voter5],
        ['Szwecja'],
        ['Francj'],
        ['Rosja'],
        ['Włochy', voter6],
        ['Słowenia'],
        ['Finlandia'],
        ['Hiszpania'],
        ['Szwajcaria'],
        ['Węgry'],
        ['Malta'],
        ['Dania'],
        ['Holandia'],
        ['San'],
        ['Wielka Brytania', voter2],
      ],
    },
  ]

  await Promise.all(ballots.map(createBallot(voting)))
}
