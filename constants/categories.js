const collectionsSlug = [
  "all-moroccan-rugs",
  "azilal-rugs",
  "beige-moroccan-rugs",
  "beni-mguild-rugs",
  "beni-ouarain-moroccan-rugs",
  "best-custom-fit-sellers",
  "best-selling-moroccan-rugs",
  "black-moroccan-rugs",
  "black-white-moroccan-rugs",
  "blue-moroccan-rugs",
  "boucherouite-moroccan-rugs",
  "boujad-moroccan-rugs",
  "brown-moroccan-rugs",
  "custom-moroccan-rugs-size",
  "gold-moroccan-rugs",
  "gray-moroccan-rugs",
  "green-moroccan-rugs",
  "in-stock-moroccan-rugs",
  "kilim-rugs",
  "large-moroccan-rugs",
  "medium-rugs",
  "mrirt-moroccan-rugs",
];

const handledCollections = {
  188573909129: "all-moroccan-rugs",
  280608080061: "azilal-rugs",
  235043946685: "beige-moroccan-rugs",
  239214526653: "beni-mguild-rugs",
  233752985789: "beni-ouarain-moroccan-rugs",
  629467021657: "best-custom-fit-sellers",
  235023892669: "best-selling-moroccan-rugs",
  235149885629: "black-moroccan-rugs",
  628922253657: "black-white-moroccan-rugs",
  242133369021: "blue-moroccan-rugs",
  239209054397: "boucherouite-moroccan-rugs",
  224267206820: "boujad-moroccan-rugs",
  235150311613: "brown-moroccan-rugs",
  239530180797: "custom-moroccan-rugs-size",
  279773085885: "gold-moroccan-rugs",
  235044339901: "gray-moroccan-rugs",
  279773249725: "green-moroccan-rugs",
  629379432793: "in-stock-moroccan-rugs",
  210115362980: "kilim-rugs",
  186884063369: "large-moroccan-rugs",
  235024056509: "medium-rugs",
  203750932644: "mrirt-moroccan-rugs",
};

const missingProductsId = [ , 9725546299737]


const reviews = [
  {
    reviewer: "Alice Johnson",
    email: "alice.johnson@example.com",
    rating: 5,
    comment: "Absolutely love this rug! The colors are vibrant, and it fits perfectly in my living room.",
    date: "2024-11-01"
  },
  {
    reviewer: "Bob Smith",
    email: "bob.smith@example.com",
    rating: 4,
    comment: "Great quality, but delivery took a little longer than expected.",
    date: "2024-11-03"
  },
  {
    reviewer: "Charlie Brown",
    email: "charlie.brown@example.com",
    rating: 5,
    comment: "Exactly what I was looking for! Soft, durable, and stylish.",
    date: "2024-11-05"
  },
  {
    reviewer: "Diana Prince",
    email: "diana.prince@example.com",
    rating: 3,
    comment: "The rug is decent, but the color was slightly off from the pictures.",
    date: "2024-11-07"
  },
  {
    reviewer: "Ethan Hunt",
    email: "ethan.hunt@example.com",
    rating: 5,
    comment: "Amazing quality for the price. Highly recommend!",
    date: "2024-11-10"
  },
  {
    reviewer: "Fiona Carter",
    email: "fiona.carter@example.com",
    rating: 4,
    comment: "Very soft and comfortable. Matches my decor perfectly.",
    date: "2024-11-12"
  },
  {
    reviewer: "George Williams",
    email: "george.williams@example.com",
    rating: 5,
    comment: "Better than expected! The material feels luxurious.",
    date: "2024-11-15"
  },
  {
    reviewer: "Helen Martin",
    email: "helen.martin@example.com",
    rating: 4,
    comment: "The rug is great, but it has a slight chemical smell initially.",
    date: "2024-11-17"
  },
  {
    reviewer: "Ian Wright",
    email: "ian.wright@example.com",
    rating: 5,
    comment: "Delivered on time and looks just like the pictures. Very satisfied.",
    date: "2024-11-20"
  },
  {
    reviewer: "Jackie Adams",
    email: "jackie.adams@example.com",
    rating: 3,
    comment: "The size is slightly smaller than advertised, but still nice.",
    date: "2024-11-22"
  },
  {
    reviewer: "Karen Lopez",
    email: "karen.lopez@example.com",
    rating: 5,
    comment: "Beautiful rug! The patterns are stunning.",
    date: "2024-11-25"
  },
  {
    reviewer: "Liam Davis",
    email: "liam.davis@example.com",
    rating: 4,
    comment: "Good rug for the price, though it’s thinner than I expected.",
    date: "2024-11-28"
  },
  {
    reviewer: "Mia Taylor",
    email: "mia.taylor@example.com",
    rating: 5,
    comment: "Perfect addition to my home. Soft and high-quality material.",
    date: "2024-12-01"
  },
  {
    reviewer: "Noah Clark",
    email: "noah.clark@example.com",
    rating: 4,
    comment: "Very happy with this rug. Great value for the money.",
    date: "2024-12-04"
  },
  {
    reviewer: "Olivia Scott",
    email: "olivia.scott@example.com",
    rating: 5,
    comment: "The design is unique and beautiful. Highly recommend this rug.",
    date: "2024-12-06"
  },
  {
    reviewer: "Paul Miller",
    email: "paul.miller@example.com",
    rating: 3,
    comment: "Not bad, but the edges started to fray after a few weeks.",
    date: "2024-12-08"
  },
  {
    reviewer: "Quinn Wilson",
    email: "quinn.wilson@example.com",
    rating: 5,
    comment: "This rug exceeded my expectations. Very soft and durable.",
    date: "2024-12-10"
  },
  {
    reviewer: "Rachel Evans",
    email: "rachel.evans@example.com",
    rating: 4,
    comment: "Nice rug, but it arrived with some creases that took time to flatten.",
    date: "2024-12-13"
  },
  {
    reviewer: "Sam Turner",
    email: "sam.turner@example.com",
    rating: 5,
    comment: "Absolutely stunning! My guests always compliment it.",
    date: "2024-12-15"
  },
  {
    reviewer: "Tina Brooks",
    email: "tina.brooks@example.com",
    rating: 4,
    comment: "Good quality, but I wish it came in more color options.",
    date: "2024-12-18"
  },
  {
    reviewer: "Uma Green",
    email: "uma.green@example.com",
    rating: 5,
    comment: "The patterns are gorgeous, and the texture is very soft.",
    date: "2024-12-20"
  },
  {
    reviewer: "Victor Harris",
    email: "victor.harris@example.com",
    rating: 3,
    comment: "The rug is okay, but it slides around on hardwood floors.",
    date: "2024-12-23"
  },
  {
    reviewer: "Wendy Morgan",
    email: "wendy.morgan@example.com",
    rating: 5,
    comment: "Love this rug! It’s stylish and comfortable underfoot.",
    date: "2024-12-25"
  },
  {
    reviewer: "Xavier Bell",
    email: "xavier.bell@example.com",
    rating: 4,
    comment: "Great purchase. The colors are exactly as shown in the pictures.",
    date: "2024-12-27"
  },
  {
    reviewer: "Yara Foster",
    email: "yara.foster@example.com",
    rating: 5,
    comment: "Perfect size and design. It ties my room together.",
    date: "2024-12-30"
  },
  {
    reviewer: "Zane Reed",
    email: "zane.reed@example.com",
    rating: 5,
    comment: "Amazing rug! Worth every penny.",
    date: "2025-01-01"
  }
];


module.exports = {
  collectionsSlug,
  handledCollections,
  missingProductsId,
  reviews
};
