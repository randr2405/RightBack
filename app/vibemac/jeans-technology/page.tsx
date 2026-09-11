"use client";

import ProductCard from "@/components/ProductCard";
import CategoryHero from "@/components/CategoryHero";

const products = [
  {
    brand: "Vibemac",
    name: "Programmable Skip Twin Needle Unit and Corner — VM14",
    tagline: "Three-mode programmable twin needle unit for corners and standard stitching",
    description: [
      "The VM14 is a programmable skip twin needle unit, capable of operating in three modes: corner, PLC, and standard 2-skip-needle. The corner mode is ideal for sewing corners on pockets, flaps, and cargo trousers.",
    ],
    moreInfo: [
      "Meanwhile, the PLC mode enables custom 1–2 needle sequences and allows up to four different operations to be performed on a single unit. This means manufacturers can replace multiple 1–2 needle standard machines with just one VM14, reducing the number of operators, helpers, and machines required. As a result, it helps save space, energy, compressed air, and spare parts. In addition, with optional IoT integration, the VM14 supports efficient production data sharing and improved process monitoring, enhancing both control and overall performance.",
    ],
  },
  {
    brand: "Vibemac",
    name: "Front Pocket Hemming Unit with Tape Insertion and New Electronics — VM13",
    tagline: "Double-needle lockstitch unit for front pocket hemming with tape insertion",
    description: [
      "The VM13 front pocket hemming unit is a double-needle lockstitch unit equipped with a Vi.Be.Mac. sewing head. It is specifically designed to simplify front pocket hemming with tape insertion, while simultaneously applying reinforcing or branded tape in a single step. As a result, it ensures excellent seam quality and high productivity, even on heavy fabrics.",
    ],
    moreInfo: [
      "Moreover, thanks to upgraded electronics and optional IoT integration, the VM13 allows real-time data sharing and process monitoring. This enables better control, improved efficiency, and easier integration into modern production lines.",
    ],
  },
  {
    brand: "Vibemac",
    name: "Automatic Label Setting Unit — VM12",
    tagline: "Precision label and Velcro attachment for denim and heavy fabrics",
    description: [
      "The VM12 builds on Vi.Be.Mac.'s commitment to precision, durability, and user-focused design. Specifically developed for denim and other heavy fabric applications, it ensures consistent and accurate label and Velcro attachment, adapting easily to different materials and thicknesses typically used in jeans production. Its advanced configuration options simplify machine use and help maintain high production standards through reliable, repeatable quality.",
    ],
    moreInfo: [
      "With improved flexibility and a newly redesigned clamping system, the VM12 offers greater adaptability and ease of use across a wide range of applications. It is the ideal solution for manufacturers who require consistent results, high productivity, and fast, precise operation—without the need for complex adjustments.",
    ],
  },
  {
    brand: "Vibemac",
    name: "Automatic Fly Piece Unit for Left and Right J-Stitch — VM10A",
    tagline: "Programmable J-stitch fly piece unit, no jigs required",
    description: [
      "The VM10A is an automatic fly piece unit, programmable for performing \"J-stitch\" operations on both left and right front fly panels. Suitable for jeans, casual trousers, and work wear, it offers full customization of the J pattern with maximum design freedom—no additional jigs required.",
    ],
    moreInfo: [
      "Thanks to its user-friendly interface and reliable Vi.Be.Mac. Sewing head, the VM10A delivers high-speed production without the need for skilled operators. The tool-free switch between male and female fly pieces ensures flexibility and ease of use across multiple garment types.",
      "Moreover, with optional IoT and Industry 4.0 integration, the machine enables real-time data sharing, piece counting, working hours monitoring, and instant alerts—boosting control, efficiency, and quality throughout the production process.",
    ],
  },
  {
    brand: "Vibemac",
    name: "Bottom Hemming Unit — VM04",
    tagline: "The benchmark trouser hemline solution, IoT-ready",
    description: [
      "A benchmark in the Vi.Be.Mac. Product line, the VM04 bottom hemmer is entirely designed and manufactured in-house, maintaining the world-class standards that have made it a reference point in the industry. This unit provides the ultimate solution for trouser hemline operations, offering precision, productivity, and the flexibility that defines all Vi.Be.Mac. Products. With IoT and Industry 4.0 compatibility, the VM04 bottom hemmer allows for efficient production data sharing and improved process monitoring, enhancing control and performance.",
    ],
    moreInfo: [
      "Fast Conversion: thanks to the fast conversion kit the VM04 unit can be converted in less than 25 minutes from lock to chain and reverse.",
    ],
  },
  {
    brand: "Vibemac",
    name: "Feed off the Arm 3 Needle Chain Stitch — VM03.1",
    tagline: "Upgraded feed-off-the-arm unit with patented pressure control",
    description: [
      "The feed of arm VM03.1 is the upgraded version of the VM03 sewing machine. This arm unit features the classic 3-needle chain stitch and incorporates new enhancements for optimal performance.",
      "The VM03.1 maintains the well-known feed off the arm sewing head shape, recognized as a standard in the global market. Its versatile design makes it particularly well-suited for sewing back yoke, back rise, inseam, out seams, and top-stitching operations with precision.",
    ],
    moreInfo: [
      "Operating at 4999 rpm, the VM03.1 comes equipped with essential features such as oil feeding lubrication, a puller device, and a specialized sensor for Dynamic Pressure Presser Foot Control (DCP technology, PATENTED).",
      "Notably, the electronic cutting system marks a significant advancement from the previous pneumatic system, ensuring efficient and precise cutting for enhanced functionality.",
      "With IoT and Industry 4.0 compatibility, the VM03.1 enables production data sharing and process monitoring, for enhanced control and performance.",
    ],
  },
  {
    brand: "Vibemac",
    name: "Automatic Pocket Setter with Cold Folding Group — VM02",
    tagline: "Programmable pocket setter with retractable inner clamp",
    description: [
      "Vi.Be.Mac model VM02, automatic programmable pocket setter machine with cold folding group, is the most efficient solution on the market. High productivity combined with excellent quality are the strengths of this automatic machine. Its ease of use enables even non-expert workers to operate it without any effort. The retractable inner clamp ensures high stitching quality across various fabrics.",
    ],
    moreInfo: [
      "Additionally, not needing a pocket creasing machine saves space and energy, boosting productivity instantly. Custom pocket jigs can be made locally or shipped with sewing programs in a matter of days.",
      "Both programming and adjustments can be managed directly through the machine's intuitive interface.",
    ],
  },
  {
    brand: "Vibemac",
    name: "Automatic Back Pocket Setter with Cold Folding Group — VM01",
    tagline: "Italian cold-creasing back pocket attacher, now with automatic loader",
    description: [
      "The VM01 is a state-of-the-art pocket attaching unit developed with Italian technology. Featuring an innovative cold creasing system, it efficiently attaches back pockets on jeans and work trousers without the need for pre-ironing. With adjustable speed and the ability to handle various pocket designs, the VM01 is a versatile addition to any production line.",
    ],
    moreInfo: [
      "Moreover, its wide working area and the ability to raise the sewing mechanism for more room make it stand out from standard pattern machines. Additionally, the unit's easy changeability of jigs and its cost-effectiveness provide enhanced flexibility.",
      "Now With Fully Automatic Loader: in its latest version, the VM01 can be optionally equipped with a new automatic loader, which handles the back panel positioning, pocket folding, and stitching — all without operator intervention.",
    ],
  },
  {
    brand: "Vibemac",
    name: "Back Pocket Creaser — VC101HAM",
    tagline: "Fast, safe creasing for round and square pockets",
    description: [
      "Model VC101HAM, Vi.Be.Mac. Back pocket creaser, guarantees perfect creasing quality, to both round and square pockets and a very quick change of jigs thanks to the pneumatic lock-unlock device, reducing idle times. Maximum productivity is always guaranteed. The jigs for our back pocket creaser VC101HAM are produced in a very short time and at low cost or they can be even locally made.",
    ],
    moreInfo: [
      "Large Creasing Area: able to satisfy every fashion and size request in the market.",
      "Quick Mold Change: change of mold in few minutes and with maximum safety.",
      "Safe Creasing: thanks to the safety shields that avoid accidental burns.",
    ],
  },
  {
    brand: "Vibemac",
    name: "Reverse 3 Needle Chain Stitch Feed off the Arm Unit — V2262HP",
    tagline: "Made in Italy, patented pressure control for reverse FOA operations",
    description: [
      "V2262HP is the Vi.Be.Mac unit version made for the specific requirement of reverse lap feed off the arm (reverse foa). Strong, fast, precise, consistent in the stitch length. V2262HP is equipped with patented DCP (Dynamic Control Pressure) technology, differential feed dog, zeromax puller. It is particularly suitable to sew back yoke, back rise, inseam and out seams, plus top stitch operations. The reverse foa of Vi.Be.Mac SpA made in Italy.",
    ],
    moreInfo: [
      "Zeromax Puller: for fast feeding on different kind of denim fabric, granting the match of the different panels during the sewing operation.",
      "Differential Feeding: differential feed dog system with independent setting, allowing the highest flexibility in sewing of different fabrics, with the max comfort for the operator.",
      "DCP (Dynamic Control Pressure) Patented Technology: the operator doesn't need to slow down the operations in the critical points. The presser foot of this reverse foa will adapt itself automatically on every edge or crotch point.",
    ],
  },
  {
    brand: "Vibemac",
    name: "Automatic Eyelet Button Hole Unit — V900.1",
    tagline: "Fully automatic eyelet button hole unit with loader and unloader",
    description: [
      "Model V900.1 is a fully automatic eyelet button hole unit with loader and unloader. The distance between the bottom holes is programmable with the touch screen panel, adjustments are very easy and they take only few seconds. Thanks to the quick change of both finished fly and to do fly boxes, the downtime for the sewing head of V900.1 is reduced to zero.",
    ],
    moreInfo: [
      "The loader of our fully automatic eyelet button hole unit works with a patented device which doesn't damage the denim fabric. Moreover the alignment of the patch is completely automatic, assuring always a perfect quality result.",
    ],
  },
  {
    brand: "Vibemac",
    name: "Automatic Side Seam Serging Unit — V800.1",
    tagline: "High-output serging with vacuum-assisted automatic cutting",
    description: [
      "The side seam surging unit is an important production requirement for the nowadays fashion industry. Beside the basic units it considerably increases the production output, providing a great support to the operator. The side seam serging unit has been specifically developed to grant a high quality result, even on stretch denim fabrics, automating multiple functions that before were completely made by the operator. The new pneumatic device for example, it's improving the panel movement thanks to a sensors system.",
    ],
    moreInfo: [
      "In terms of costs saving this unit is the benchmark in its category, installing a new cutting system working with a vacuum, granting a high rate of thread saving.",
      "Patented Air-Assisted Transport System: the transport system allows a well assisted handling of the fabric during the sewing operation.",
      "Extra Oil System with Intercooler Pump: 4 litres extra oil, always working at the maximum speed without any stop.",
      "Vacuum Device and Sensor: automatic cutting system connected with a vacuum device, with sensor for cut at begin and end of operation in an automatic and programmable way.",
    ],
  },
  {
    brand: "Vibemac",
    name: "3 Needle Chain Stitch Automatic Back Pocket Hemming Unit — V702",
    tagline: "High-output back pocket hemmer, up to 2,000 pockets/hour",
    description: [
      "Flexible, high-performance unit designed for efficient production. A single V702 can feed multiple lines, saving space while delivering high output: 1,800–2,000 pockets per hour. Its patented transport system handles different fabric thicknesses, from denim to stretch and work wear, ensuring consistent quality.",
    ],
    moreInfo: [
      "The LDR01 automatic loader is equipped with IoT technology, allowing real-time data sharing and process monitoring to improve control and productivity.",
      "Innovative Pneumatic System (Patented): high productivity with no more wave effect or hem arching problems on denim fabrics.",
      "Adjustable Belt and Folder: both the devices can be adjusted according to fabric thickness for cost saving and easy setup on different styles.",
      "Programmable Cut: the automatic cut at beginning and at the end is programmable with a specific control panel.",
      "Loader LDR-01: with loader LDR-01, the units become automatic, with no manual pocket loading. IoT technology supports back pocket hemming process monitoring.",
    ],
  },
  {
    brand: "Vibemac",
    name: "2 Needle Lock Stitch Automatic Back Pocket Hemming Unit — V701",
    tagline: "Flexible back pocket hemmer, up to 1,800 pockets/hour",
    description: [
      "The V701 is a flexible and high-performance unit designed specifically for efficient back pocket hemming operations. It supports modern production lines by feeding multiple machines at once, helping you save floor space while maintaining high output—up to 1,800 pockets per hour. Thanks to its patented transport system, the V701 handles a wide range of fabric types and thicknesses. Whether you're working with stretch materials, denim, or heavy-duty workwear, it ensures consistent quality for every back pocket hemming cycle.",
    ],
    moreInfo: [
      "In addition, to further boost productivity, the system can be paired with the LDR01 automatic loader. This loader includes IoT technology for real-time data sharing and monitoring. As a result, you gain better process control and can easily track performance across your back pocket hemming line.",
      "Innovative Pneumatic System (Patented): high productivity with no more wave effect or hem arching problems on denim fabrics.",
      "Adjustable Belt and Folder: both the devices can be adjusted according to fabric thickness for cost saving and easy setup on different styles.",
      "Programmable Cut: the automatic cut at the beginning and at the end of the pocket hemming operation is programmable, thanks to the specific control panel.",
      "Loader LDR-01: with loader LDR-01, the units become automatic, with no manual pocket loading. IoT technology supports back pocket hemming process monitoring.",
    ],
  },
  {
    brand: "Vibemac",
    name: "Loop Creasing Unit — V500-3D",
    tagline: "High-speed simultaneous creasing for simple and 3D loops",
    description: [
      "The V500-3D is a highly efficient and versatile Vi.Be.Mac loop creasing unit that has been specifically designed to meet the demands of modern 3D/Q loops. With its high-speed creasing capabilities, this unit can produce a large volume of creased loops in a short amount of time, while maintaining a consistently high level of quality. This cutting-edge unit is capable of creasing two simple loops or three 3D loops simultaneously, making it an invaluable tool for any manufacturing operation that requires high-speed, accurate and reliable loop creasing.",
    ],
    moreInfo: [
      "Powerful and dynamic vario-motor feeding of this loop creaser made in Italy for perfect linear regulation of the RPM without \"cooked\" effect on the loop.",
      "Hi-tech thermostat for perfect adjustment on every kind of fabric especially on the light and stretch with a constant temperature on the iron-plates.",
      "Superior iron-plate and auto moved puller track system, for easy joint and folds' crossing.",
    ],
  },
  {
    brand: "Vibemac",
    name: "2 Needle Chain Stitch Flat Bed Felling Unit — V364.1",
    tagline: "Flatbed felling machine built for stretch denim",
    description: [
      "The V364.1 is a flatbed machine equipped with Vi.Be.Mac. sewing head, 2 needle chain stitch, needle feed and semi-dry lubrication, ideal for lap felling of the yoke seams, rise seams, inseam & out seam, top stitch. This model ensures user-friendliness, high-quality sewing, production. The machine's soft belt puller device, the revolutionary presser foot equipped with DCP technology (Dynamic Control of the Pressure on the presser foot) and the useful table that comes already assembled with the machine make this unit a very functional working station.",
    ],
    moreInfo: [
      "Needle Feeding Technology: for the best quality result without puckering effect even on the most difficult stretch denim fabrics.",
      "Large Table: for a easier and better handling of the panels during the sewing operation, with more comfort for the operator.",
      "New Thread Trimmer: with photocell system and single cut. For a better quality result and lower running costs in the life last of the blades and thread saving.",
    ],
  },
  {
    brand: "Vibemac",
    name: "Automatic Continuous Waistband Unit — V300.2",
    tagline: "Italian-made waistband attaching unit with worldwide convertible stitch",
    description: [
      "Vi.Be.Mac V300.2 is an Automatic Continuous Waistband Attaching Unit designed specifically for jeans, casual trousers, and denim jackets. This machine is entirely manufactured in Italy and equipped with Vi.Be.Mac sewing head, which is designed and developed by Vi.Be.Mac R&D department. With its remarkable simplicity of design, improved speed, electronic control of fabric transport, and various other features, this automatic continuous waistband attaching unit is the perfect solution for meeting all kinds of fashion requirements from trousers and jeans.",
    ],
    moreInfo: [
      "One of the main advantages of the V300.2 is its ability to guarantee perfect results in the waistband attaching, even on the most difficult stretch fabrics and banana-shaped waistbands. The electronic control of fabric transport and various other features ensure that the unit produces consistent, high-quality results.",
      "Moreover, the FLX model version of this unit is convertible from lockstitch to chain stitch and vice versa or mixed solutions, thanks to its patented worldwide system. This feature makes the V300.2 able to satisfy any waistband attaching style request and provides added flexibility to the unit's operations.",
      "Needle Feeding Technology: able to perform on the most difficult stretch fabrics, always granting high result in waistband attaching, even with waistband banana shape.",
      "Automatic Waistband Cut and Skip Stitch: the unique unit able to provide this great advantage, assuring a high precision and saving helper's manual operation.",
      "Mechanical Skip Stitch and Pneumatic Tensions (with 3 positions): for better quality with light and stretch fabric.",
    ],
  },
  {
    brand: "Vibemac",
    name: "3 Needle Chain Stitch Feed off the Arm Unit — V263",
    tagline: "The fastest feed-off-the-arm unit in the world, direct-drive automation",
    description: [
      "The V263 is the most innovative development in the feed of the arm unit's series. In order to provide the maximum flexibility at the highest rate of efficiency, Vi.Be.Mac. Designed a new feed of the arm unit with an incredible speed and easy adjustment where the operator can change settings by himself without the need of a technician.",
      "The feed off arm foa V263 represents a new level of automation, creating a new benchmark for future technology. Direct-drive motor makes the unit the fastest feed off the arm foa in the world.",
    ],
    moreInfo: [
      "Electric Puller: the highest quality transport is granted, with no variations on stitch length and quality at every speed. Everything is synchronized, assuring also a lower consumption of spare parts thanks to the absence of any friction.",
      "Differential Transport System: differential feeding system with easy and fast adjustments (without any tool), which allows maximum flexibility in sewing different fabrics, even stretch, with maximum comfort for the operator.",
      "Vi.Be.Mac. Electronics: new Vi.Be.Mac. CPU control system for precise management of all functions on feed off arm FOA units. Equipped with a multilingual OLED display, intuitive interface, and USB software update. Ready for Industry 4.0 integration.",
    ],
  },
  {
    brand: "Vibemac",
    name: "Fully Automatic Coin Pocket Setter with Cold Folding Group — V250.CP",
    tagline: "Programmable coin pocket setter, down to 6×6cm pockets",
    description: [
      "The V250.CP is a fully automatic coin pocket setter, programmable, designed for jeans and casual wear. Equipped with a cold folding group, it operates in a fully automatic mode, but can also work alongside Vi.Be.Mac.'s VC101HAM hot creasing station for semi-automatic production, ensuring precise attachment of various coin pocket styles.",
      "This fully automatic coin pocket setter unit offers impressive adaptability across different fabrics and designs, all while utilizing double color technology, to keep operating costs low and efficiency high.",
    ],
    moreInfo: [
      "DCT (Double Color Technology) Patented: the unique V250.CP automatic coin pocket setter sewing head, with the maximum level of flexibility in terms of style and design, allows to stitch with 2 threads of 2 different colors / thickness in one single sewing cycle.",
      "Touch Screen Control: software available in multiple languages, removable, easy programming for a fast setup of new styles and sizes.",
      "Very Small Coin Pockets: possibility to attach very small coin pockets, measuring up to 6 × 6 cm.",
    ],
  },
  {
    brand: "Vibemac",
    name: "Piece by Piece Waistband Unit — V201",
    tagline: "Convertible piece-by-piece waistband application for jeans and denim jackets",
    description: [
      "V201 is Vi.Be.Mac. Piece by piece waistband application unit for jeans, casual trousers and denim jackets. The machine series is equipped with Vi.Be.Mac sewing head, which combines feed dog & needle feed transport systems. Thanks to this piece by piece waistband type of feeding, the unit can be used with the piece by piece working method. The FLX model version is convertible from lockstitch to chain stitch and vice versa or mixed solutions, making it able to satisfy any style request (patented system worldwide).",
    ],
    moreInfo: [
      "Needle Feeding Technology: able to perform on the most difficult stretch fabrics, always granting high result, even with banana shape.",
      "Zeromax Puller: for fast feeding on different kind of denim fabric, granting the match of the different panels during the sewing operation.",
      "Convertible: available with a wide range of configurations and needle gauges. Able to satisfy every style requirement. Possible also to convert the unit in configuration FLX.",
    ],
  },
  {
    brand: "Vibemac",
    name: "Overlock Unit — CG90Y",
    tagline: "Super-fast 6500 rpm overlock with puller system for perfect leg matching",
    description: [
      "The CG90Y over lock unit is equipped with a super-fast sewing head (6500 rpm) specifically made in Japan by Yamato and with the original Vi.Be.Mac. Puller system, which result is an incredible improvement in the quality of the finished garment with the 2 quarters of material perfectly coupled, no twisted effect on the legs! The puller system avoids the need of a skilled operator, who should be (in case of standard unit) pulling the quarter pieces of trousers in order to match perfectly the two parts.",
    ],
    moreInfo: [
      "Super Fast: 6500 rpm.",
      "Puller System CG90Y Overlock: made by Vi.Be.Mac. for a great support to the operator in the fabric handling and quarters matching for this over lock unit.",
      "New Design of the Stand: CG90Y over lock unit has a special cylinder inside the column that makes machine floating for easy adjustment in height.",
    ],
  },
  {
    brand: "Vibemac",
    name: "Automatic Belt Loop Setter — V4650EV9-UP3",
    tagline: "Fully customizable bar tack loop setter for classic, semi-classic, inserted and double-loop styles",
    description: [
      "Vi.Be.Mac. has developed its own belt loop setter unit, always keeping the focus on flexibility. As a result, they have created a unit that is able to satisfy many different style requirements. Specifically, the V4650EV9-UP3 belt loop setter can work on classic, semi-classic, inserted, and double-loop styles. Additionally, it is capable of performing fully customizable bar tack.",
      "When it comes to quality, the belt loop setter unit is equipped with the latest patented technologies. These technologies ensure a perfect aligned loop, a V-cut of the loop, a long-lasting cutting system, and maximum comfort for the operator.",
    ],
    moreInfo: [
      "Overall, Vi.Be.Mac.'s belt loop setter unit is a reliable and versatile choice for meeting a variety of style requirements. Whether you need to attach regular belt loops or work on classic, semi-classic, inserted, or double-loop styles, the V4650EV9-UP3 belt loop setter has got you covered.",
      "Double Compensatory Presser Foot: automatic belt loop setter with extra pressure also on multiple layers of fabric, less flexure, besides a lower barycentre.",
      "Loop Alignment System: to avoid the loop mispositioning on the fabric, especially for the folded tails (Q loop / 3D loop); the loops are always perfectly aligned, allowing the operator to work fast without the need to centre every loop.",
      "Reverse Skip Function: allows to skip thinner joint areas between short or multiple loops, ensuring perfect results even when the loop is not continuous.",
      "Clean and Precise Cut: new cutting system with single and clean cut with V or Straight shape, efficient running cost saving thanks to the long blade lasting.",
    ],
  },
  {
    brand: "Vibemac",
    name: "Semi-Automatic Back Pocket Setter — 2516V4",
    tagline: "Flexible patch pocket setter for round, square, and zip pockets",
    description: [
      "Model 2516V4 is Vi.Be.Mac. Semi-automatic pocket setter unit for jeans and pants. The unit applies any kind of pre-pressed patch pockets on jeans and casual trousers, army pants and work wear. It is possible to stitch any shape of pockets (round, square, and pocket with zip). It is also possible to apply labels, to sew darts and pleats, flap, labels, to embroider back pockets, patch, and cargo pockets.",
    ],
    moreInfo: [
      "Maximum flexibility with a wide range of fabrics, all in double colour technology with the lowest running costs. 2516V4 works perfectly side by side with Vi.Be.Mac. Hot creasing station VC101HAM. This is 2516V4 automatic pocket setter.",
      "DCT (Double Color Technology) Patented: a unique sewing head with the maximum level of flexibility in terms of style and design, it allows to stitch with 2 threads of 2 different colours / thickness in one single sewing cycle.",
      "Touch Screen Control: software available in 5 languages, removable, easy programming for a fast setup of new styles and sizes.",
    ],
  },
  {
    brand: "Vibemac",
    name: "Semi-Automatic Pocket Decorative Stitch Unit — 2516V4-DCS",
    tagline: "Precision decorative stitching for pockets, flaps, and labels",
    description: [
      "The 2516V4DCS by Vi.Be.Mac. Offers a reliable solution for pocket decoration on jeans and casual wear. Specially designed for decorative stitching, this unit combines precision and efficiency, allowing operators to achieve consistent, high-quality results across various fabric types. Supporting both flap and label attachment, it's versatile for different design elements.",
    ],
    moreInfo: [
      "With double colour technology and a user-friendly setup, the 2516V4DCS remains an efficient choice for enhancing pocket decoration aesthetics at minimal operational costs.",
      "DCT (Double Color Technology) Patented: a unique sewing head with the maximum level of flexibility in terms of style and design, it allows to stitch with two threads of 2 different colours / thickness in one single pocket decoration sewing cycle.",
      "Touch Screen Control: software available in 5 languages, removable, easy programming for a fast setup of new styles and sizes.",
    ],
  },
];

export default function JeansTechnologyPage() {
  return (
    <div className="bg-neutral-100 flex-1">
      <CategoryHero
        eyebrow="Vibemac"
        title="Jeans Technology"
        ghostWord="VIBEMAC"
        description="Precision automation for denim production — from pocket setting and hemming to waistbands and specialty stitching."
        stats={[
          { value: "24", label: "Machines" },
          { value: "IT", label: "Made in Italy" },
        ]}
      />

      <section>
        {products.map((product, i) => (
          <ProductCard key={product.name} index={i + 1} {...product} />
        ))}
      </section>
    </div>
  );
}