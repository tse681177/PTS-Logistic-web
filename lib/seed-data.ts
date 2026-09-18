import { AdminOrder, Product, TickerItem } from "./types";

export const INITIAL_TICKER_ITEMS: TickerItem[] = [
  {
    id: "tick-1",
    type: "commodity",
    name: "1-р зэргийн буудай",
    code: "WHEAT-G1",
    price: 980000,
    change_percent: 2.4,
    is_up: true,
    unit: "₮/тн",
    is_active: true,
    updated_at: "2026-09-11 18:00"
  },
  {
    id: "tick-2",
    type: "commodity",
    name: "2-р зэргийн буудай",
    code: "WHEAT-G2",
    price: 890000,
    change_percent: 1.1,
    is_up: true,
    unit: "₮/тн",
    is_active: true,
    updated_at: "2026-09-11 18:00"
  },
  {
    id: "tick-3",
    type: "commodity",
    name: "Малын хивэг (улаан буудайн)",
    code: "BRAN-FEED",
    price: 680000,
    change_percent: -0.9,
    is_up: false,
    unit: "₮/тн",
    is_active: true,
    updated_at: "2026-09-11 18:00"
  },
  {
    id: "tick-4",
    type: "commodity",
    name: "Шар буурцагны шрот (Protein 46%)",
    code: "SOYA-MEAL",
    price: 1850000,
    change_percent: 0.5,
    is_up: true,
    unit: "₮/тн",
    is_active: true,
    updated_at: "2026-09-11 18:00"
  },
  {
    id: "tick-5",
    type: "commodity",
    name: "Тэжээлийн арвай",
    code: "BARLEY-FEED",
    price: 740000,
    change_percent: -1.3,
    is_up: false,
    unit: "₮/тн",
    is_active: true,
    updated_at: "2026-09-11 18:00"
  },
  {
    id: "tick-6",
    type: "currency",
    name: "RUB / MNT",
    code: "RUBMNT",
    price: 38.45,
    change_percent: 0.2,
    is_up: true,
    unit: "₮",
    is_active: true,
    updated_at: "2026-09-11 18:00"
  },
  {
    id: "tick-7",
    type: "currency",
    name: "USD / MNT",
    code: "USDMNT",
    price: 3450.00,
    change_percent: -0.1,
    is_up: false,
    unit: "₮",
    is_active: true,
    updated_at: "2026-09-11 18:00"
  },
  {
    id: "tick-8",
    type: "currency",
    name: "CNY / MNT",
    code: "CNYMNT",
    price: 486.20,
    change_percent: 0.15,
    is_up: true,
    unit: "₮",
    is_active: true,
    updated_at: "2026-09-11 18:00"
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    title: "1-р зэргийн хүнсний улаан буудай (Алтай)",
    category: "ready",
    price_per_ton: 980000,
    currency: "₮",
    origin: "Алтай хязгаар, ОХУ",
    packaging: "Задгай вагон / 1 тн Биг-бэг",
    description: "Хүнсний дээд болон нэгдүгээр зэргийн гурилын үйлдвэрлэлд зориулсан өндөр цавуулагтай, хольцгүй сонгомол улаан буудай.",
    specs: {
      gluten: "28.4% (I бүлэг)",
      moisture: "13.2% (Стандарт ≤14.0%)",
      foreign_matter: "1.2% (Стандарт ≤2.0%)",
      test_weight: "782 г/л",
      protein: "14.1%",
      acid_value: "3.2 мг КОН"
    },
    image_url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
    lab_cert_pdf_url: "/docs/lab-cert-wheat-g1.pdf",
    lab_cert_details: {
      cert_no: "SGS-MNG-2026-0941",
      lab_name: "SGS Mongolia & Улсын Чанарын Шинжилгээний Төв Лаборатори",
      accreditation_no: "MNS ISO/IEC 17025:2018",
      issue_date: "2026-09-02",
      inspector_name: "Д.Ганчимэг (Ахлах химич-шинжээч)",
      conclusion: "MNS 0097:2010 болон ГОСТ 9353-2016 1-р зэргийн улаан буудайн стандартад бүрэн нийцсэн чанарын үзүүлэлттэй болохыг батлав.",
      parameters: [
        { name: "Цавуулгийн хэмжээ", standard: "≥ 28.0%", actual: "28.4%", unit: "%", passed: true },
        { name: "Цавуулгийн чанар (ИДК)", standard: "65-75 нэгж", actual: "70 нэгж (I бүлэг)", unit: "ед.", passed: true },
        { name: "Чийглэг", standard: "≤ 14.0%", actual: "13.2%", unit: "%", passed: true },
        { name: "Хогийн хольц", standard: "≤ 2.0%", actual: "1.18%", unit: "%", passed: true },
        { name: "Үрийн натурал жин", standard: "≥ 760 г/л", actual: "782 г/л", unit: "г/л", passed: true },
        { name: "Шиллэг чанар", standard: "≥ 60%", actual: "68%", unit: "%", passed: true },
        { name: "Хортон шавьж, хачиг", standard: "Илрэхгүй", actual: "Илрээгүй", unit: "-", passed: true }
      ]
    },
    in_stock_tons: 650,
    min_order_tons: 25,
    is_active: true
  },
  {
    id: "prod-2",
    title: "2-р зэргийн хүнсний улаан буудай (Красноярск)",
    category: "ready",
    price_per_ton: 890000,
    currency: "₮",
    origin: "Красноярск муж, ОХУ",
    packaging: "Задгай / 50 кг шуудай",
    description: "Стандарт гурил болон нарийн боовны үйлдвэрүүдэд тохиромжтой, тогтвортой цавуулаг, байгалийн цэвэршилттэй хүнсний улаан буудай.",
    specs: {
      gluten: "25.2% (I-II бүлэг)",
      moisture: "13.5%",
      foreign_matter: "1.6%",
      test_weight: "765 г/л",
      protein: "13.0%",
      acid_value: "3.8 мг КОН"
    },
    image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    lab_cert_pdf_url: "/docs/lab-cert-wheat-g2.pdf",
    lab_cert_details: {
      cert_no: "LAB-UB-2026-4412",
      lab_name: "МХЕГ-ын Хүнсний Аюулгүй Байдлын Үндэсний Лаборатори",
      accreditation_no: "TL-048",
      issue_date: "2026-08-28",
      inspector_name: "Б.Мөнхжаргал (Хяналтын шинжээч)",
      conclusion: "ГОСТ 9353-2016 2-р зэргийн буудайн шаардлагыг бүрэн хангаж байна.",
      parameters: [
        { name: "Цавуулаг", standard: "≥ 25.0%", actual: "25.2%", unit: "%", passed: true },
        { name: "Чийглэг", standard: "≤ 14.0%", actual: "13.5%", unit: "%", passed: true },
        { name: "Хогийн хольц", standard: "≤ 2.0%", actual: "1.62%", unit: "%", passed: true },
        { name: "Натура", standard: "≥ 750 г/л", actual: "765 г/л", unit: "г/л", passed: true },
        { name: "Хүнд металл (Pb, Cd)", standard: "Зөвшөөрөгдөх хэмжээнд", actual: "<0.01 мг/кг", unit: "мг/кг", passed: true }
      ]
    },
    in_stock_tons: 420,
    min_order_tons: 30,
    is_active: true
  },
  {
    id: "prod-3",
    title: "Малын тэжээлийн улаан буудайн хивэг (Ширхэгтэй)",
    category: "ready",
    price_per_ton: 680000,
    currency: "₮",
    origin: "ОХУ, Барнаул",
    packaging: "25кг / 30кг полипропилен шуудай",
    description: "Эрчимжсэн мал аж ахуй, саалийн үнээ, гахайн аж ахуйд тохиромжтой, уургийн өндөр агууламжтай, цэвэр ургамлын гаралтай тэжээл.",
    specs: {
      protein: "15.8% (Хуурай бодисоор)",
      moisture: "12.8%",
      foreign_matter: "Зөвшөөрөгдөх нормд",
      acid_value: "35 мг КОН хүртэл"
    },
    image_url: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=800&q=80",
    lab_cert_pdf_url: "/docs/lab-cert-bran-feed.pdf",
    lab_cert_details: {
      cert_no: "AGRO-VET-2026-881",
      lab_name: "Улсын Мал Эмнэлэг, Ариун Цэврийн Төв Лаборатори",
      accreditation_no: "VET-LAB-012",
      issue_date: "2026-09-05",
      inspector_name: "Ц.Оюунбилэг (Биохимич)",
      conclusion: "ГОСТ 7169-66 стандартын шаардлагыг бүрэн хангасан, пестицид үлдэгдэлгүй тэжээлийн хивэг болохыг магадлав.",
      parameters: [
        { name: "Түүхий уураг", standard: "≥ 14.0%", actual: "15.8%", unit: "%", passed: true },
        { name: "Чийглэг", standard: "≤ 14.5%", actual: "12.8%", unit: "%", passed: true },
        { name: "Түүхий эслэг", standard: "≤ 9.0%", actual: "8.1%", unit: "%", passed: true },
        { name: "Үнслэг", standard: "≤ 6.0%", actual: "4.9%", unit: "%", passed: true }
      ]
    },
    in_stock_tons: 890,
    min_order_tons: 10,
    is_active: true
  },
  {
    id: "prod-4",
    title: "Шар буурцагны шрот (Soya Meal, Protein 46%)",
    category: "preorder",
    price_per_ton: 1850000,
    currency: "₮",
    origin: "ОХУ, Амур / Приморье",
    packaging: "1 тн Биг-бэг / 50кг шуудай",
    description: "Шувуу, гахай болон эрчимжсэн үхрийн амин хүчлээр баялаг уургийн гол орц. Төмөр замаар 60тн вагоноор гэрээгээр нийлүүлнэ.",
    specs: {
      protein: "46.5% - 48.0%",
      moisture: "11.5%",
      oil_content: "≤ 1.5%",
      acid_value: "Зөвшөөрөгдөх хэмжээнд"
    },
    image_url: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80",
    lab_cert_pdf_url: "/docs/lab-cert-soya-meal.pdf",
    lab_cert_details: {
      cert_no: "SGS-RU-2026-559",
      lab_name: "SGS Vostok Ltd Testing Laboratory",
      accreditation_no: "GOST-R-12294",
      issue_date: "2026-08-15",
      inspector_name: "А.В. Смирнов",
      conclusion: "ГМО-гүй, өндөр шингэц бүхий 1-р зэргийн шар буурцагны шрот болох нь батлагдав.",
      parameters: [
        { name: "Түүхий протеин", standard: "≥ 46.0%", actual: "46.8%", unit: "%", passed: true },
        { name: "Чийглэг", standard: "≤ 12.0%", actual: "11.2%", unit: "%", passed: true },
        { name: "Уреазын идэвх", standard: "0.05-0.2 pH", actual: "0.12 pH", unit: "pH", passed: true },
        { name: "Түүхий өөх тос", standard: "≤ 2.0%", actual: "1.4%", unit: "%", passed: true }
      ]
    },
    in_stock_tons: 0,
    min_order_tons: 60,
    is_active: true
  },
  {
    id: "prod-5",
    title: "Тэжээлийн овъёос (Feed Oats)",
    category: "preorder",
    price_per_ton: 720000,
    currency: "₮",
    origin: "ОХУ, Новосибирск",
    packaging: "Задгай вагон / 40кг шуудай",
    description: "Хурдан морь болон үржлийн малын тэжээлд зориулагдсан, цэвэршилт өндөртэй тэжээлийн ургац.",
    specs: {
      test_weight: "≥ 520 г/л",
      moisture: "12.9%",
      foreign_matter: "≤ 2.0%",
      protein: "11.8%"
    },
    image_url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
    lab_cert_pdf_url: "/docs/lab-cert-oats.pdf",
    lab_cert_details: {
      cert_no: "LAB-NSK-2026-102",
      lab_name: "Новосибирскийн Хөдөө Аж Ахуйн Чанарын Төв",
      accreditation_no: "RA.RU.21ПЮ43",
      issue_date: "2026-08-20",
      inspector_name: "И.П. Козлов",
      conclusion: "ГОСТ 28673-2019 тэжээлийн овъёосны шаардлага хангасан.",
      parameters: [
        { name: "Натура жин", standard: "≥ 500 г/л", actual: "525 г/л", unit: "г/л", passed: true },
        { name: "Чийглэг", standard: "≤ 13.5%", actual: "12.9%", unit: "%", passed: true },
        { name: "Хольц", standard: "≤ 2.5%", actual: "1.8%", unit: "%", passed: true }
      ]
    },
    in_stock_tons: 0,
    min_order_tons: 65,
    is_active: true
  },
  {
    id: "prod-6",
    title: "Техникийн рапс (Үр)",
    category: "preorder",
    price_per_ton: 1450000,
    currency: "₮",
    origin: "ОХУ, Алтай",
    packaging: "1 тн Биг-бэг / Задгай вагон",
    description: "Тос шахах үйлдвэрүүдэд зориулсан 42%-иас дээш тослогийн агууламжтай чанарын шаардлага хангасан рапсын үр.",
    specs: {
      oil_content: "43.5%",
      moisture: "7.8%",
      foreign_matter: "1.9%",
      acid_value: "1.8 мг КОН"
    },
    image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    lab_cert_pdf_url: "/docs/lab-cert-rapeseed.pdf",
    lab_cert_details: {
      cert_no: "SGS-RAPS-2026-302",
      lab_name: "SGS Agricultural Testing Center",
      accreditation_no: "MNS ISO 17025",
      issue_date: "2026-09-01",
      inspector_name: "М.А. Васильева",
      conclusion: "Эрукийн хүчлийн агууламж < 1.0%, тослог өндөр стандартын рапс мөн.",
      parameters: [
        { name: "Тослог (хуурай бодист)", standard: "≥ 40.0%", actual: "43.5%", unit: "%", passed: true },
        { name: "Чийглэг", standard: "≤ 8.0%", actual: "7.8%", unit: "%", passed: true },
        { name: "Хогийн хольц", standard: "≤ 2.0%", actual: "1.9%", unit: "%", passed: true }
      ]
    },
    in_stock_tons: 0,
    min_order_tons: 120,
    is_active: true
  }
];

// Rich sample orders. Notice: Driver names, Driver phone, Truck plate, and Container number
// exist ONLY in AdminOrder, and will be filtered out for public queries!
export const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: "ord-1",
    order_code: "PTS-2026-8942",
    product_name: "1-р зэргийн буудай (Алтай)",
    quantity_tons: 240,
    destination: "Улаанбаатар, Толгойт өртөө",
    transport_type: "rail",
    status: 3, // Замдаа явж байна
    status_label: "Замдаа явж байна",
    current_location: "Дархан өртөөгөөр дамжин өнгөрсөн (Хяналтын пост #3)",
    departure_date: "2026-09-08 11:30",
    estimated_arrival: "2026-09-12 16:00",
    updated_at: "2026-09-11 14:20",
    created_at: "2026-09-07 09:15",
    // SENSITIVE ADMIN-ONLY FIELDS:
    customer_company: "Улаанбаатар Гурил ХХК",
    customer_contact_person: "Г.Тэмүүлэн (Хангамжийн менежер)",
    customer_phone: "9911-8421",
    contract_no: "UBG-2026/09-01",
    payment_status: "paid",
    driver_name: "Н.Батбаатар (Галт тэрэгний цувааны ахлагч)",
    driver_phone: "9908-4412",
    vehicle_plate: "-",
    container_number: "RZD-54219803, RZD-54219814 (4 вагон)",
    admin_notes: "Төлбөр 100% Голомт банкаар орж ирсэн. Толгойт 3-р замд буулгана."
  },
  {
    id: "ord-2",
    order_code: "PTS-2026-8945",
    product_name: "Малын хивэг (Ширхэгтэй)",
    quantity_tons: 35,
    destination: "Төв аймаг, Зуунмод сум",
    transport_type: "truck",
    status: 4, // Тээврийн зангилаанд ирсэн
    status_label: "Тээврийн зангилаанд ирсэн",
    current_location: "Улаанбаатар терминалд ирж, Зуунмод руу түгээлтэд бэлтгэгдэж байна",
    departure_date: "2026-09-09 08:00",
    estimated_arrival: "2026-09-11 20:00",
    updated_at: "2026-09-11 16:45",
    created_at: "2026-09-08 14:00",
    // SENSITIVE ADMIN-ONLY FIELDS:
    customer_company: "Мөнхийн Сүрэг Ферм ХХК",
    customer_contact_person: "Д.Доржсүрэн (Захирал)",
    customer_phone: "9909-5523",
    contract_no: "MSF-2026/89",
    payment_status: "paid",
    driver_name: "Ч.Энхтайван",
    driver_phone: "8811-9034",
    vehicle_plate: "4589 УБА (Howo чирэгч)",
    container_number: "-",
    admin_notes: "Зуунмод төв фермийн хашаанд буулгана. Жолоочид 2 дахь рейс."
  },
  {
    id: "ord-3",
    order_code: "PTS-2026-8950",
    product_name: "Шар буурцагны шрот (Protein 46%)",
    quantity_tons: 120,
    destination: "Улаанбаатар, Амгалан өртөө",
    transport_type: "rail",
    status: 2, // Ачигдаж байгаа
    status_label: "Ачигдаж байгаа",
    current_location: "ОХУ-ын Наушки хилийн боомт дээр гаалийн бүрдүүлэлт хийгдэж байна",
    departure_date: "2026-09-11 10:00",
    estimated_arrival: "2026-09-15 18:00",
    updated_at: "2026-09-11 17:30",
    created_at: "2026-09-10 11:30",
    // SENSITIVE ADMIN-ONLY FIELDS:
    customer_company: "Баян Шувуу ХХК",
    customer_contact_person: "Ц.Баярмаа",
    customer_phone: "9191-2289",
    contract_no: "BSH-2026-04",
    payment_status: "advance_50",
    driver_name: "РЖД Экспресс диспетчер",
    driver_phone: "+7-924-551-8902",
    vehicle_plate: "-",
    container_number: "TCKU-9821445, TCKU-9821450",
    admin_notes: "50% урьдчилгаа авсан. Очих өдөр үлдэгдэл шилжинэ."
  },
  {
    id: "ord-4",
    order_code: "PTS-2026-8930",
    product_name: "2-р зэргийн буудай",
    quantity_tons: 68,
    destination: "Дархан-Уул аймаг, Дархан хот",
    transport_type: "truck",
    status: 5, // Хүргэгдсэн
    status_label: "Хүргэгдсэн",
    current_location: "Дархан хотын элеваторт хүлээлгэн өгсөн",
    departure_date: "2026-09-06 09:00",
    estimated_arrival: "2026-09-08 14:00",
    updated_at: "2026-09-08 15:10",
    created_at: "2026-09-05 16:20",
    // SENSITIVE ADMIN-ONLY FIELDS:
    customer_company: "Дархан Гурил ХК",
    customer_contact_person: "С.Эрдэнэбат",
    customer_phone: "9511-7744",
    contract_no: "DG-2026/09-12",
    payment_status: "paid",
    driver_name: "Ж.Мөнхбат",
    driver_phone: "9977-1122",
    vehicle_plate: "1234 ДАР",
    container_number: "-",
    admin_notes: "Акт амжилттай зурагдсан. Шинжилгээний хариу тэнцсэн."
  },
  {
    id: "ord-5",
    order_code: "PTS-2026-8955",
    product_name: "Тэжээлийн арвай",
    quantity_tons: 140,
    destination: "Сүхбаатар аймаг, Баруун-Урт",
    transport_type: "rail",
    status: 1, // Баталгаажсан
    status_label: "Баталгаажсан",
    current_location: "ОХУ-ын нийлүүлэгчтэй вагоны хуваарь батлагдсан",
    departure_date: "2026-09-13 09:00",
    estimated_arrival: "2026-09-18 17:00",
    updated_at: "2026-09-11 12:00",
    created_at: "2026-09-11 10:45",
    // SENSITIVE ADMIN-ONLY FIELDS:
    customer_company: "Дорнын Тал Хоршоо",
    customer_contact_person: "П.Бат-Эрдэнэ",
    customer_phone: "9811-3355",
    contract_no: "DTH-2026-08",
    payment_status: "paid",
    driver_name: "Төмөр замын диспетчер #2",
    driver_phone: "7000-8822",
    vehicle_plate: "-",
    container_number: "RZD-61209341",
    admin_notes: "Чойр өртөөн дээрээс авто тээвэрт шилжүүлэн Баруун-Урт хүргэх төлөвлөгөөтэй."
  }
];
