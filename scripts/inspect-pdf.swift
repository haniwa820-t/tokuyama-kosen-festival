import AppKit
import PDFKit

guard CommandLine.arguments.count == 3 else {
  fatalError("Usage: swift inspect-pdf.swift input.pdf output-directory")
}
let input = URL(fileURLWithPath: CommandLine.arguments[1])
let output = URL(fileURLWithPath: CommandLine.arguments[2], isDirectory: true)
try FileManager.default.createDirectory(at: output, withIntermediateDirectories: true)
guard let document = PDFDocument(url: input) else { fatalError("Cannot open PDF") }
var text = ""
for index in 0..<document.pageCount {
  guard let page = document.page(at: index) else { continue }
  text += "\n--- PAGE \(index + 1) ---\n" + (page.string ?? "[No text layer]") + "\n"
  let box = page.bounds(for: .mediaBox)
  let image = page.thumbnail(of: NSSize(width: 1300, height: 1300 * box.height / box.width), for: .mediaBox)
  guard let tiff = image.tiffRepresentation,
        let bitmap = NSBitmapImageRep(data: tiff),
        let png = bitmap.representation(using: .png, properties: [:]) else { fatalError("Cannot render page") }
  try png.write(to: output.appendingPathComponent("page-\(index + 1).png"))
}
try text.write(to: output.appendingPathComponent("text.txt"), atomically: true, encoding: .utf8)
print("Rendered \(document.pageCount) pages and extracted text into \(output.path)")
