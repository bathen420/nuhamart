import React from "react";

const CODE128_PATTERNS = [
    "212222","222122","222221","121223","121322","131222","122213","122312","132212","221213",
    "221312","231212","112232","122132","122231","113222","123122","123221","223211","221132",
    "221231","213212","223112","312131","311222","321122","321221","312212","322112","322211",
    "212123","212321","232121","111323","131123","131321","112313","132113","132311","211313",
    "231113","231311","112133","112331","132131","113123","113321","133121","313121","211331",
    "231131","213113","213311","213131","311123","311321","331121","312113","312311","332111",
    "314111","221411","431111","111224","111422","121124","121421","141122","141221","112214",
    "112412","122114","122411","142112","142211","241211","221114","413111","241112","134111",
    "111242","121142","121241","114212","124112","124211","411212","421112","421211","212141",
    "214121","412121","111143","111341","131141","114113","114311","411113","411311","113141",
    "114131","311141","411131","211412","211214","211232","2331112"
];

const EAN_L = ["0001101","0011001","0010011","0111101","0100011","0110001","0101111","0111011","0110111","0001011"];
const EAN_G = ["0100111","0110011","0011011","0100001","0011101","0111001","0000101","0010001","0001001","0010111"];
const EAN_R = ["1110010","1100110","1101100","1000010","1011100","1001110","1010000","1000100","1001000","1110100"];
const EAN_PARITY = ["LLLLLL","LLGLGG","LLGGLG","LLGGGL","LGLLGG","LGGLLG","LGGGLL","LGLGLG","LGLGGL","LGGLGL"];

function eanCheckDigit(base) {
    return String((10 - [...base].reduce((sum, digit, index) => sum + Number(digit) * (index % 2 === 0 ? 1 : 3), 0) % 10) % 10);
}

function normalizeEan(value) {
    const digits = String(value ?? "").replace(/\D/g, "");
    if (digits.length === 12) return digits + eanCheckDigit(digits);
    if (digits.length === 13 && eanCheckDigit(digits.slice(0, 12)) === digits[12]) return digits;
    return null;
}

function eanBits(value) {
    const code = normalizeEan(value);
    if (!code) return null;
    const parity = EAN_PARITY[Number(code[0])];
    let bits = "101";
    for (let i = 1; i <= 6; i++) bits += (parity[i - 1] === "L" ? EAN_L : EAN_G)[Number(code[i])];
    bits += "01010";
    for (let i = 7; i <= 12; i++) bits += EAN_R[Number(code[i])];
    return { bits: bits + "101", text: code };
}

function code128Modules(value) {
    const text = String(value ?? "").replace(/[^\x20-\x7E]/g, "?") || "-";
    const codes = [104];
    for (const char of text) codes.push(char.charCodeAt(0) - 32);
    let checksum = 104;
    for (let i = 1; i < codes.length; i++) checksum += codes[i] * i;
    codes.push(checksum % 103, 106);

    const modules = [];
    let black = true;
    for (const code of codes) {
        for (const width of CODE128_PATTERNS[code]) {
            modules.push({ black, width: Number(width) });
            black = !black;
        }
    }
    return { modules, text };
}

export default function BarcodeSvg({ value, type = "code128", height = 54, showText = true, className = "" }) {
    if (type === "ean13") {
        const result = eanBits(value);
        if (!result) return <div className={`text-xs text-red-600 ${className}`}>Invalid EAN-13</div>;
        const quiet = 9;
        const width = result.bits.length + quiet * 2;
        return (
            <svg className={className} viewBox={`0 0 ${width} ${height + (showText ? 14 : 0)}`} role="img" aria-label={`Barcode ${result.text}`} preserveAspectRatio="none">
                <rect width={width} height={height + 14} fill="white" />
                {[...result.bits].map((bit, index) => bit === "1" ? <rect key={index} x={quiet + index} y="0" width="1" height={height} fill="black" /> : null)}
                {showText && <text x={width / 2} y={height + 11} textAnchor="middle" fontFamily="monospace" fontSize="9">{result.text}</text>}
            </svg>
        );
    }

    const result = code128Modules(value);
    const quiet = 10;
    const moduleWidth = result.modules.reduce((sum, item) => sum + item.width, 0);
    const width = moduleWidth + quiet * 2;
    let x = quiet;
    return (
        <svg className={className} viewBox={`0 0 ${width} ${height + (showText ? 14 : 0)}`} role="img" aria-label={`Barcode ${result.text}`} preserveAspectRatio="none">
            <rect width={width} height={height + 14} fill="white" />
            {result.modules.map((item, index) => {
                const currentX = x;
                x += item.width;
                return item.black ? <rect key={index} x={currentX} y="0" width={item.width} height={height} fill="black" /> : null;
            })}
            {showText && <text x={width / 2} y={height + 11} textAnchor="middle" fontFamily="monospace" fontSize="9">{result.text}</text>}
        </svg>
    );
}
