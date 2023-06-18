import { test, expect } from '@playwright/test';
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

  test('Deberia poder realizar una potencia de exponente 2 ', async ({ page }) => {
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

  test('Debería poder realizar una división', async ({ page }) => {

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

})

