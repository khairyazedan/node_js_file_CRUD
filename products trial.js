/ const DATA_DIR = path.resolve(__dirname, "data");
// const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
// // //get file if there and create if doesnot
// router.get("/", async (req, res) => {
//   const fileName = req.query.fileName;
//   if(fileName !== path.basename(fileName)){
//     return res.status(400).json({message:"Invalid file name"});
//   }
//   const filePath = path.join(DATA_DIR, fileName);
//   if (!filePath.startsWith(DATA_DIR + path.sep)) {
//     return res.status(400).json({ error: "Invalid file name" });
//   }
//   try {
//     await fs.promises.mkdir(DATA_DIR, { recursive: true });
//     await fs.promises.access(fileName, fs.constants.F_OK);
//     return res.status(200).json({ message: "File already exists" });
//   } catch {
//     // File does not exist — create it
//     try {
//       await fs.promises.writeFile(fileName, "[]");
//       return res.status(201).json({ message: "File created" });
//     } catch (writeErr) {
//       console.error("error writing file", writeErr);
//       return res.status(500).json({ error: "Failed to create file" });
//     }
//   }
  
// });
