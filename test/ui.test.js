import { test, expect,chromium } from '@playwright/test';
import { seed } from '../src/seed.js';
import { Operation, History } from '../src/models.js'

test.describe('test', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async () => {
    await seed();
  });

  test('Deberia tener como titulo de pagina recalc', async ({ page }) => {
    await page.goto('./');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/recalc/i);
  });

  test('Deberia poder realizar una resta', async ({ page }) => {
    await page.goto('./');

    await page.getByRole('button', { name: '7' }).click()
    await page.getByRole('button', { name: '9' }).click()
    await page.getByRole('button', { name: '-' }).click()
    await page.getByRole('button', { name: '9' }).click()
    
    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/v1/sub/')),
      page.getByRole('button', { name: '=' }).click()
    ]);

    const { result } = await response.json();
    expect(result).toBe(70);

    await expect(page.getByTestId('display')).toHaveValue(/70/)

    const operation = await Operation.findOne({
      where: {
        name: "SUB"
      }
    });

    const historyEntry = await History.findOne({
      where: { OperationId: operation.id }
    })

    expect(historyEntry.firstArg).toEqual(79)
    expect(historyEntry.secondArg).toEqual(9)
    expect(historyEntry.result).toEqual(70)
  });


  test.describe('Deberia poder realizar una potencia de exponente 2', () => {   
    test('Deberia poder realizar una potencia de 3, que se muestre el resultado y que se guarde en el historial', async ({ page }) => {
      await page.goto('./');

      await page.getByRole('button', { name: '3' }).click()
      await page.getByRole('button', { name: '^2' }).click()

      const [response] = await Promise.all([
        page.waitForResponse((r) => r.url().includes('/api/v1/pow/')),
        page.getByRole('button', { name: '=' }).click()
      ]);
      const { result } = await response.json();
      expect(result).toBe(9);

      await expect(page.getByTestId('display')).toHaveValue(/9/)

      const operation = await Operation.findOne({
        where: {
          name: "POW"  }
        });
    
        const historyEntry = await History.findOne({
          where: { OperationId: operation.id }
        })
        expect(historyEntry.firstArg).toEqual(3)
        expect(historyEntry.secondArg).toEqual(3)
        expect(historyEntry.result).toEqual(9)
    });
    
    test('Si quiero hacer la potencia de un numero mayor a 100000, deberia mostrarse un mensaje de error en la calculadora', async ({ page }) => {
      await page.goto('./');
      await page.getByRole('button', { name: '1' }).click()
      await page.getByRole('button', { name: '0' }).click()
      await page.getByRole('button', { name: '0' }).click()
      await page.getByRole('button', { name: '0' }).click()
      await page.getByRole('button', { name: '0' }).click()
      await page.getByRole('button', { name: '1' }).click()
      await page.getByRole('button', { name: '^2' }).click()
      await page.getByRole('button', { name: '=' }).click()
      await expect(page.getByTestId('display')).toHaveValue("Math error")
    }); 
  });
  
  test('Deberia poder realizar una multiplicación', async ({ page }) => {

      await page.goto('./');
  
      await page.getByRole('button', { name: '1' }).click()
      await page.getByRole('button', { name: '0' }).click()
      await page.getByRole('button', { name: '*' }).click()
      await page.getByRole('button', { name: '3' }).click()
  
      const [response] = await Promise.all([
        page.waitForResponse((r) => r.url().includes('/api/v1/mul/')),
        page.getByRole('button', { name: '=' }).click()
      ]);
  
      const { result } = await response.json();
      expect(result).toBe(30);
  
      await expect(page.getByTestId('display')).toHaveValue(/30/)
  
      const operation = await Operation.findOne({
        where: {
          name: "MUL"
        }
      });
  
      const historyEntry = await History.findOne({
        where: { OperationId: operation.id }
      })
  
      expect(historyEntry.firstArg).toEqual(10)
      expect(historyEntry.secondArg).toEqual(3)
      expect(historyEntry.result).toEqual(30)
  });

  test('Deberia poder realizar una multiplicación entre dos numeros negativos', async ({ page }) => {

    await page.goto('./');
  
    await page.getByRole('button', { name: '-' }).click()
    await page.getByRole('button', { name: '4' }).click()
    await page.getByRole('button', { name: '*' }).click()
    await page.getByRole('button', { name: '-' }).click()
    await page.getByRole('button', { name: '5' }).click()
  
    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/v1/mul/')),
      page.getByRole('button', { name: '=' }).click()
    ]);
  
    const { result } = await response.json();
    expect(result).toBeGreaterThan(0);
  
  });
  

  test.describe('Deberia poder realizar una division', () => {   

    test('Debería poder realizar la division 8/2, mostrarse en pantalla y guardarse en el historial', async ({ page }) => {

      await page.goto('./');
    
      await page.getByRole('button', { name: '8', exact: true }).click();
      await page.getByRole('button', { name: '/', exact: true }).click();
      await page.getByRole('button', { name: '2', exact: true }).click();
    
      const [response] = await Promise.all([
        page.waitForResponse((r) => r.url().includes('/api/v1/div/')),
        page.getByRole('button', { name: '=' }).click()
      ]);
    
      const { result } = await response.json();
      expect(result).toBe(4);
    
      await expect(page.getByTestId('display')).toHaveValue(/4/);
    
      const operation = await Operation.findOne({
        where: {
          name: "DIV"
        }
      });
    
      const historyEntry = await History.findOne({
        where: { OperationId: operation.id }
      });
    
      expect(historyEntry.firstArg).toEqual(8);
      expect(historyEntry.secondArg).toEqual(2);
      expect(historyEntry.result).toEqual(4);
    });

    
    test('Si el divisor ingresado es 0, me tendría que mostrar un mensaje de error en la pantalla', async ({ page }) => {
      await page.goto('./');

      await page.getByRole('button', { name: '4' }).click()
      await page.getByRole('button', { name: '/', exact: true }).click();
      await page.getByRole('button', { name: '0' }).click()
      await page.getByRole('button', { name: '=' }).click()
      await expect(page.getByTestId('display')).toHaveValue("Math error")
    }); 
  });

  test('Debería poder realizar una suma', async ({ page }) => {
    await page.goto('./');

    await page.getByRole('button', { name: '1' }).click()
    await page.getByRole('button', { name: '4' }).click()
    await page.getByRole('button', { name: '+' }).click()
    await page.getByRole('button', { name: '3' }).click()
    await page.getByRole('button', { name: '0' }).click()

    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/v1/sum/')),
      page.getByRole('button', { name: '=' }).click()
    ]);

    const { result } = await response.json();
    expect(result).toBe(44);

    await expect(page.getByTestId('display')).toHaveValue(/44/)

    const operation = await Operation.findOne({
      where: {
        name: "ADD"
      }
    });

    const historyEntry = await History.findOne({
      where: { OperationId: operation.id }
    })

    expect(historyEntry.firstArg).toEqual(14)
    expect(historyEntry.secondArg).toEqual(30)
    expect(historyEntry.result).toEqual(44)
  });

  test('Debería poder realizar una raiz cuadrada', async ({ page }) => {
    await page.goto('./');

    await page.getByRole('button', { name: '1' }).click()
    await page.getByRole('button', { name: '6' }).click()
    await page.getByRole('button', { name: 'raiz' }).click()

    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/v1/sqrt/')),
      page.getByRole('button', { name: '=' }).click()
    ]);

    const { result } = await response.json();
    expect(result).toBe(4);

    await expect(page.getByTestId('display')).toHaveValue(/4/)

    const operation = await Operation.findOne({
      where: {
        name: "SQRT"
      }
    });

    const historyEntry = await History.findOne({
      where: { OperationId: operation.id }
    })

    expect(historyEntry.firstArg).toEqual(16)
    expect(historyEntry.result).toEqual(4)
  });

  test('La raiz cuadrada de un numero negativo, me tendría que mostrar un mensaje de error en la pantalla', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: '-' }).click()
    await page.getByRole('button', { name: '1' }).click()
    await page.getByRole('button', { name: '6' }).click()
    await page.getByRole('button', { name: 'raiz' }).click()
    await page.getByRole('button', { name: '=' }).click()
    await expect(page.getByTestId('display')).toHaveValue("Math error")
  });


  test('Debería poder realizar una conversion de decimal a binario', async ({ page }) => {
    await page.goto('./');

    await page.getByRole('button', { name: '1' }).click()
    await page.getByRole('button', { name: '0' }).click()
    await page.getByRole('button', { name: '(Dec. A Bin.)' }).click()

    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/v1/bin/')),
      page.getByRole('button', { name: '=' }).click()
    ]);

    const { result } = await response.json();
    expect(result).toBe("1010");

    await expect(page.getByTestId('display')).toHaveValue(/1010/)

    const operation = await Operation.findOne({
      where: {
        name: "BIN"
      }
    });

    const historyEntry = await History.findOne({
      where: { OperationId: operation.id }
    })

    expect(historyEntry.firstArg).toEqual(10)
    expect(historyEntry.result).toEqual(1010)
  });

  test('Al presionar = el display no debería cambiar', async ({ page }) => {
    await page.goto('./');

    await page.getByRole('button', { name: '5' }).click()
    await page.getByRole('button', { name: '=' }).click()

    await expect(page.getByTestId('display')).toHaveValue(/5/)
  });

  test('Al presionar C el display debería estar vacío', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: '5' }).click()
    await page.getByRole('button', { name: 'c', exact: true }).click();
    await expect(page.getByTestId('display')).toHaveValue('')
  });

  test('Al hacer clic en un elemento que no sea un botón, el display debería mantenerse igual', async ({ page }) => {
    await page.goto('./');
    
    const displayInicial = await page.$eval('.display', (display) => display.value);
    const buttonsDiv = await page.$('.buttons');  
    await buttonsDiv.evaluateHandle((div) => div.click());
    const displayActual = await page.$eval('.display', (display) => display.value);
    
    expect(displayActual).toBe(displayInicial);
  });




  test('Verificar si las operaciones se muestran en el historial de la calculadora y se guardan en la base de datos', async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('localhost:8080');

    await page.getByRole('button', { name: '4' }).click()
    await page.getByRole('button', { name: '+' }).click()
    await page.getByRole('button', { name: '3' }).click()
    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/v1/sum/')),
      page.getByRole('button', { name: '=' }).click()
    ]);

    await page.waitForTimeout(1000);

    const historialContent = await page.$eval('#historial', (element) => element.innerHTML);

    expect(historialContent).toContain("4+3=7");

    const operation = await Operation.findOne({
      where: {
        name: "ADD"
      }
    });

    const historyEntry = await History.findOne({
      where: { OperationId: operation.id }
    })

    expect(historyEntry.firstArg).toEqual(4)
    expect(historyEntry.secondArg).toEqual(3)
    expect(historyEntry.result).toEqual(7)

    await browser.close();
  });

  test('Verificar si se borran las operaciones del historial de la calculadora y se eliminan de la base de datos', async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('localhost:8080');

    await page.getByRole('button', { name: '4' }).click()
    await page.getByRole('button', { name: '+' }).click()
    await page.getByRole('button', { name: '3' }).click()
    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/v1/sum/')),
      page.getByRole('button', { name: '=' }).click()
    ]);

    await page.waitForTimeout(1000);

    const historialContent = await page.$eval('#historial', (element) => element.innerHTML);

    expect(historialContent).toContain("4+3=7");

    const operation = await Operation.findOne({
      where: {
        name: "ADD"
      }
    });
    const historyEntries = await History.findAll({
      where: { OperationId: operation.id }
    });

    expect(historyEntries.length).toBeGreaterThan(0);

    await page.getByRole('button', { name: 'CLR' }).click()

    await page.waitForTimeout(1000);

    const historialContentAfterClear = await page.$eval('#historial', (element) => element.innerHTML);

    expect(historialContentAfterClear).toContain("");

    const historialDespuesDeBorrar = await History.findAll({
      where: { OperationId: operation.id }
    });

    expect(historialDespuesDeBorrar.length).toEqual(0);

    await browser.close();
  });

  test('Deberia poder realizar una multiplicación, con datos ingresados por teclado',async({ page})=>{
    await page.goto('./');

    await page.keyboard.press('9');
    await page.keyboard.press('*');
    await page.keyboard.press('4');
    // await page.keyboard.press('Enter');

    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/v1/mul/')),
      page.keyboard.press('Enter')
    ]);

    const { result } = await response.json();
    expect(result).toBe(36);

    await expect(page.getByTestId('display')).toHaveValue(/36/)
    const operation = await Operation.findOne({
      where: {
        name: "MUL"
      }
    });

    const historyEntry = await History.findOne({
      where: { OperationId: operation.id }
    })

    expect(historyEntry.firstArg).toEqual(9)
    expect(historyEntry.secondArg).toEqual(4)
    expect(historyEntry.result).toEqual(36)

  });

  test('Debería cambiar el background del body al hacer clic en el botón #mode', async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto('./');
    const modeButton = await page.$('#mode');
    
    const backBodyInicial = await page.$eval('body', (element) => getComputedStyle(element));
    await modeButton.click();
    await page.waitForTimeout(500);
    const backBodyActual = await page.$eval('body', (element) => getComputedStyle(element));
    expect(backBodyActual.backgroundColor).not.toBe(backBodyInicial.backgroundColor);
    await browser.close();
    
    });
  

})