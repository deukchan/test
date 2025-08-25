const apiKey = "N2RZrkVV5CpJ0kaxXJmq5HbjPiy9qFi4"; 
const date = "20250825"; 
const proxy = "https://cors-anywhere.herokuapp.com/";
const url = `${proxy}https://oapi.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${apiKey}&searchdate=${date}&data=AP01`;

const tableBody = document.querySelector("#rateTable tbody");
const currencySelect = document.getElementById("currencySelect");
const refreshBtn = document.getElementById("refreshBtn");

let rateData = [];

function formatUnit(unit) {
    // undefined, null, 빈 문자열 → "-"
    if (!unit || unit.trim() === "") return "-";
    // 숫자로 변환 가능한 경우만 3자리마다 콤마
    const n = parseInt(unit);
    return isNaN(n) ? unit : n.toLocaleString();
}

function formatStringNumber(num) {
    // undefined, null, 빈 문자열 → "-"
    if (!num || num.trim() === "") return "-";
    return num; // 문자열 그대로 표시
}

async function fetchRate() {
    try {
        const res = await fetch(url);
        const data = await res.json();
        rateData = data;
        populateSelect(data);
        renderTable();
    } catch (err) {
        tableBody.innerHTML = `<tr><td colspan='7' style='color:red;'>에러 발생: ${err.message}</td></tr>`;
    }
}

function populateSelect(data) {
    currencySelect.innerHTML = "<option value=''>전체 통화</option>";
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.cur_nm;
        option.textContent = item.cur_nm;
        currencySelect.appendChild(option);
    });
}

function renderTable() {
    const selectedCurrency = currencySelect.value;
    tableBody.innerHTML = "";
    rateData
        .filter(item => !selectedCurrency || item.cur_nm === selectedCurrency)
        .forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.cur_nm}</td>
                <td>${formatUnit(item.cur_unit)}</td>
                <td class="highlight">${formatStringNumber(item.kftc_deal_bas_r)}</td>
                <td>${formatStringNumber(item.ttb)}</td>
                <td>${formatStringNumber(item.tts)}</td>
                <td>${formatStringNumber(item.mtt)}</td>
                <td>${formatStringNumber(item.mtb)}</td>
            `;
            tableBody.appendChild(row);
        });
}

currencySelect.addEventListener("change", renderTable);
refreshBtn.addEventListener("click", fetchRate);

fetchRate();