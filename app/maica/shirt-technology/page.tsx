"use client";

import ProductCard from "@/components/ProductCard";
import CategoryHero from "@/components/CategoryHero";

const products = [
  {
    brand: "Maica",
    name: "Sleeve Placket Setter — UAM 04",
    tagline: "Fully automated sleeve placket folding and sewing",
    description: [
      "This machine is a unique fully automated system that allows to fold and sew the sleeve plackets to the sleeves without them needing to be pre-ironed. It is equipped with two patented MAICA Folding heads right and left side which allow to prepare the next piece while the machine is sewing the current one. The laser helps the operator to perfectly place and align striped fabrics. A vacuum system, along with blades, will fold it to make it ready for the stitching part.",
    ],
    moreInfo: [
      "The length of the sleeve placket can be adjusted using the same jigs, but different widths will make you change it for a new one. The width can go from 15mm to 30mm. Two stackers will follow the process and move the finished pieces to the back of the unit.",
      "Everything is controlled by the computer so that the operator only needs to feed the machine. This option allows us to act directly from Italy if a problem is detected using only the Wi-Fi.",
    ],
  },
  {
    brand: "Maica",
    name: "Collar and Cuff Runstitch Machine — UAM 03",
    tagline: "Patented knotted stitch for collars and cuffs",
    description: [
      "This machine is a unique fully automated system that allows to sew collars and cuffs with a patented MAICA knotted stitch sewing machine. The pieces are also trimmed and stacked automatically.",
    ],
    moreInfo: [
      "This unit is controlled electronically by the computer, which means that the system allows any type of stitching with an automatic size change.",
      "This option allows us to act directly from Italy if a problem is detected using only the Wi-Fi. The new jigs for the new shapes can be easily changed and have minimum costs.",
      "Plus, collars and cuffs are trimmed separately from the sewing phase, giving the possibility to have completely different cut and sewing lines, if needed. The machine is flexible and gives different applications options (flaps, shoulder pads...).",
    ],
  },
  {
    brand: "Maica",
    name: "Pocket Setter — UAM 01",
    tagline: "Automated pocket attachment, no pre-ironing needed",
    description: [
      "The automated unit UAM 01 with its patented MAICA sewing head was created to attach the pocket, which does not need to be pre-ironed.",
      "The speed of the machine can be used for big productions, but can be adapted to small productions as well. The lasers help the operator to perfectly place and align the fabric.",
    ],
    moreInfo: [
      "A vacuum system, along with blades, will fold it to make it ready for the stitching part. The flexibility of the machine also allows to sew labels and collar bones. Furthermore, a new application allows the machine to sew the task with its flap at the same time. Thanks to a 35 × 35cm area, this unit is the perfect solution for working clothes tasks attachments.",
      "The program containing all the shapes and pockets data can be changed directly on the machine, which is controlled by the computer. This option allows us to act directly from Italy if a problem is detected, using only the Wi-Fi. The cost of the jigs and its easy changeability makes this unit very flexible.",
    ],
  },
  {
    brand: "Maica",
    name: "Cuff Topstitch Machine — UAM05",
    tagline: "Fast topstitching for any cuff shape",
    description: [
      "The UAM05 is the ideal solution to reduce times during the production of the cuffs. The machine can create the topstitch to all kind of cuff shapes, thanks to the ability to change the jigs quickly and without the use of tools.",
      "With its patented head whose speed can be adapted and the fully automatic loading and unloading system, it allows the machine to be operated without the operator being present.",
    ],
    moreInfo: [
      "The program containing all the shapes and cuffs sizes can be changed directly on the machine, which is controlled by the computer.",
      "Furthermore, the user-interface gives you all relevant information such as cycle times and how many pieces have been produced. This option allows us to act directly from Italy if a problem is detected, using only the Wi-Fi.",
    ],
  },
  {
    brand: "Maica",
    name: "Points Cutting and Turning Machine — MTP",
    tagline: "Perfect collar points, no dies required",
    description: [
      "The MTP unit was made to shear the collars' points and reverse them in order to have a perfect point on the finished collar. It is an electro-pneumatic system equipped with a unique blade that can be moved to adjust the shearing angle. No dies are required. The machine is controlled by a PLC system.",
    ],
  },
  {
    brand: "Maica",
    name: "Collar Cutter — MTC",
    tagline: "Precision, speed, and interchangeable references",
    description: [
      "This pneumatically operated device was specially designed to cut any type of collar before fitting it to the strip, with precision and speed.",
      "It is equipped with various reference points that are interchangeable depending on the collar shape.",
    ],
  },
  {
    brand: "Maica",
    name: "Cuff Pressing and Fusing Machine — MSP",
    tagline: "Automated heating, fusing, and finishing for cuffs",
    description: [
      "This machine was created to work, no matter how high the operator's capacity to feed the machine may be. The cuff must be reversed manually by the operator and put on the expandable and interchangeable plate, where it will be positioned automatically. The cuff will then go into the machine between two heated conveyors where it will be heated and also fused, according to the pre-cycle. Once completed, the cuff is automatically ironed and plasticized by a heated plate and brought to the stacker, where it will cool until the operator collects all the finished cuffs.",
    ],
    moreInfo: [
      "The patented unit is also equipped with a PLC to regulate the work cycle through a touch-screen (time and temperature), based on the material type.",
    ],
  },
  {
    brand: "Maica",
    name: "Front Sewing Machine — MCD",
    tagline: "Consistent sewing lines on pre-ironed shirt fronts",
    description: [
      "The automatic MCD unit, completed with a single needle sewing machine, was made to sew one or more sewing lines on the pre-ironed front of shirts. The main characteristic is the \"easy to use\" giving speed and quality results to all different models. During the stitching, a vacuum system keeps automatically the fabric aligned for a perfect sewing line, allowing the operator to work on several machines at the same time. Once finished, the fabric passes under a heated puller to eliminate the wrinkles from the front strip. The width will depend on how the front placket has been ironed and can vary between 0.8 and 30mm. However, the distance between the border and the sewing line is adjustable by moving the vacuum guide and by changing the foot guide.",
    ],
    moreInfo: [
      "The machine is equipped with an automated cutting-thread system to separate the different pieces before the stacker. The speeds of the sewing and the conveyor are adjustable electronically.",
    ],
  },
  {
    brand: "Maica",
    name: "Automated Front Sewing Machine — MACD",
    tagline: "High-speed sewing for non-pre-ironed front plackets",
    description: [
      "The automatic MACD unit was made to sew one or more sewing lines at the same time on the non-pre-ironed front plackets.",
    ],
    moreInfo: [
      "Its main features are the easiness to use which, combined to its high-speed results in a high quality production. Thanks to the belts that transport the pieces to the sewing station, the fabric goes through a folder that allows the machine to fold the front placket and insert the tape before sewing the fabric. An automated cutting-thread system was added to the end of the operation to separate all the pieces which are still attached from the same thread.",
      "This unit is the ultimate solution for large productions of single models, ensuring the best productivity and quality.",
    ],
  },
  {
    brand: "Maica",
    name: "Buttonholes Indexer — MA 04",
    tagline: "Fast, aligned buttonhole placement",
    description: [
      "The MA 04 model was made to conduct the buttonholes operation faster than ever, thanks to its vacuum system making the placement and alignment of the fabric extremely easy. This machine continually sews the buttonholes with the help of an auto-moving system, allowing the operator to work on more than one machine at the same time.",
    ],
    moreInfo: [
      "A program, accessible through a touch screen, has been added to allow to have different sized shirts and also different gaps between the buttonholes on one shirt. These options are possible thanks to a motorised conveyor feeding the machine with the shirt.",
      "An automatic stacker at the end of the operation collects all the finished shirts.",
    ],
  },
  {
    brand: "Maica",
    name: "Button Indexer — MA 06",
    tagline: "Fast, aligned button sewing",
    description: [
      "The MA 06 model was made to conduct the button sewing operation faster than ever, thanks to its vacuum system that makes the placement and alignment of the fabric extremely easy. The machine continually sews the buttons with the help of an auto-moving system, allowing the operator to work on more than one machine at the same time.",
    ],
    moreInfo: [
      "A program, accessible through a touch screen, has been added to allow to have different sized shirts and also different gaps between the buttonholes on one shirt. These options are possible thanks to a motorised conveyor feeding the machine with the shirt.",
      "An automatic stacker at the end of the operation collects all the finished shirts.",
    ],
  },
  {
    brand: "Maica",
    name: "Collar Notches — 3006",
    tagline: "Precise center and shoulder-attach marking for collars",
    description: [
      "Machine 3006 was specifically designed to mark the collars on the centre and on the shoulder attach with its needles. The different sizes of the collars are pre-registered in the system and are accessible through the touch-screen.",
    ],
    moreInfo: [
      "The machine can contain up to 60 different models and allows to save time thanks to a stacker, installed on its rear.",
    ],
  },
  {
    brand: "Maica",
    name: "Collar Pressing Machine — 1006",
    tagline: "Patented mould-based ironing for any collar type",
    description: [
      "Unit 1006 allows a perfect ironing of any type of collar, thanks to a patented system based on moulds and counter moulds, easy to install and at minimum costs. The machine operates with a double pressing system and a PLC to set the right time and temperature.",
    ],
    moreInfo: [
      "The pressing plates are covered with a special rubber to avoid shiny effects on the collars, especially on the dark colours. A thermostatic system regulates the temperature of both upper and lower pressing plates, ensuring an even heating of the collar at the highest quality result possible.",
    ],
  },
  {
    brand: "Maica",
    name: "Front Pressing Machine — 1005",
    tagline: "Vacuum-assisted precision folding for fronts and half sleeves",
    description: [
      "The 1005 unit will fold front and half sleeves, using a vacuum and a pressing system which allow complete precision on the entire length of the crease.",
      "After placing the piece with the help of references points, the vacuum system will hold it in order for the operator to fold perfectly the remaining part. Please note that an adhesive system can be added to the machine, if needed. Then, a blowing system will help sending the shirt under the pressing plates for the creasing part. The width can be adjusted from 18mm to 70mm as well as the length that goes up to 900mm.",
    ],
    moreInfo: [
      "The cleaning of the suction plates is fast and easy. The machine is also equipped with a stacker at the back, which helps the operator to not waste time after each cycle.",
    ],
  },
];

export default function ShirtTechnologyPage() {
  return (
    <div className="bg-neutral-100 flex-1">
      <CategoryHero
        eyebrow="Maica"
        title="Shirt Technology"
        ghostWord="MAICA"
        description="Patented automated systems for shirt manufacturing — from sleeve plackets and collars to buttonholes and finishing."
        stats={[
          { value: "14", label: "Machines" },
          { value: "IT", label: "Remote Support" },
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