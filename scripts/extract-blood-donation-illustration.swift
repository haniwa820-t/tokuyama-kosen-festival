// Export only the illustration from the supplied pamphlet, leaving its original intact.
import AppKit
import PDFKit

guard CommandLine.arguments.count == 3 else {
  fatalError("Usage: swift extract-blood-donation-illustration.swift source.pdf output.png")
}
guard let document = PDFDocument(url: URL(fileURLWithPath: CommandLine.arguments[1])),
      let page = document.page(at: 7) else { fatalError("Cannot read pamphlet page 8") }
let box = page.bounds(for: .mediaBox)
let thumbnail = page.thumbnail(of: NSSize(width: 2600, height: 2600 * box.height / box.width), for: .mediaBox)
guard let tiff = thumbnail.tiffRepresentation,
      let bitmap = NSBitmapImageRep(data: tiff),
      let image = bitmap.cgImage else { fatalError("Cannot render pamphlet page") }
let scale = CGFloat(image.width) / 1300
let region = CGRect(x: 790 * scale, y: 590 * scale, width: 330 * scale, height: 301 * scale)
guard let cropped = image.cropping(to: region),
      let png = NSBitmapImageRep(cgImage: cropped).representation(using: .png, properties: [:]) else {
  fatalError("Cannot export illustration")
}
try png.write(to: URL(fileURLWithPath: CommandLine.arguments[2]))
print("Exported illustration only from pamphlet page 8; printed venue and medical text are not included.")
