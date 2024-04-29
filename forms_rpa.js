import puppeteer from 'puppeteer';

async function start_browser(puppeteer, headless){
    const browser = await puppeteer.launch({headless: headless, args:['--no-sandbox']});
    const page = await browser.newPage();
    const pages = await browser.pages();
    await pages[0].close();
    return page;
};

async function set_page(url, page){
    await page.goto(url);
    return page;
};

async function fill_out_form(page, data){
    //Essa função busca todos os elementos label da página e insere os dados no próximo elemento (input) de acordo com os dados fornecidos.
    //A função acaba sendo bem eficiente já que todos os labels deste formulário estão disponíveis desde a primeira página, ou seja, só é necessário executar essa função uma vez e todos os dados de cada página são inseridos.
    await page.$$eval('label', (labels, data) => {labels.forEach(label => {
        const label_text = label.innerText.trim();
        if(data[label_text]){
            const input = label.nextElementSibling;
            input.value = data[label_text];
        }
    });
    }, data);
};

async function click_button(page, button){
    await page.click(button);
    return page;
};

function validate_email(email){
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(regex.test(email)){
        console.log('E-mail válido.')
        return true;
    } else {
        console.log('E-mail inválido.')
        return false;
    }
};

async function main(){

    const data = {
        'Nome Completo': 'João Paulo Fernandes',
        'Telefone': '31994827884',
        'E-mail': 'jpf@gmail.com',
        'CEP': '30350660',
        'Endereço': 'Rua confidencial, 1',
        'Cidade': 'Belo Horizonte',
        'Estado': 'Minas Gerais',
        'Nome do Titular': 'João Paulo Fernandes',
        'Número do Cartão': '5129 9228 0032 6274',
        'Data de Validade': '05/2025',
        'CVV': '107',
    };
    const url = 'https://onfly-rpa-forms-62njbv2kbq-uc.a.run.app/';
    const next_button = '#next-btn';

    if(validate_email(data['E-mail'])){
        const headless = false;
        let page = await start_browser(puppeteer, headless);
        page = await set_page(url, page);
        await fill_out_form(page, data);
        page = await click_button(page, next_button);
        page = await click_button(page, next_button);
        page = await click_button(page, next_button);
        await page.waitForNavigation();
        await page.close();
        console.log('Formulário preenchido com êxito!');
    } else{
        console.log('O e-mail não é válido.');
    }
};

main();
