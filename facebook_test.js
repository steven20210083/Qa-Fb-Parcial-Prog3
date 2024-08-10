const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const assert = require("assert");

describe('Prueba de Automatizacion de Facebook', function() {
    this.timeout(30000);
    let driver;
  
    before(async function() {
      // Configurar las opciones de Chrome
      let options = new chrome.Options();
        

// Desactivar notificaciones
options.addArguments('--disable-notifications');

      // Iniciar el navegador con las opciones configuradas
      driver = await new Builder()
          .forBrowser('chrome')
          .setChromeOptions(options)
          .build();
    });

    // 1. Iniciar sesión fallida
    it("fallar al iniciar sesión con datos incorrectos", async function () {
        await driver.get("https://www.facebook.com");
        await driver.findElement(By.id("email")).sendKeys("usuariomalo@kio.do");
        await driver.findElement(By.id("pass")).sendKeys("prueba123", Key.RETURN);
        await driver.wait(until.elementLocated(By.xpath('//*[@id="email_container"]/div[2]/a')),10000
        );

        const mensajeError = await driver.findElement(By.xpath('//*[@id="email_container"]/div[2]/a'));
        assert(mensajeError, "falló correctamente");
    });

    // 2. Iniciar sesión correcta
    it("lograr iniciar sesión correctamente", async function () {
        await driver.get("https://www.facebook.com");
        await driver
            .findElement(By.id("email"))
            .sendKeys("sda20210083@yopmail.com");
        await driver.findElement(By.id("pass")).sendKeys("s1dtvea4", Key.RETURN);
        await driver.wait(until.elementLocated(By.css('div[aria-label="Crear"]')),10000);

    });


    // 3.debería verificar las Personas que quizá conozcas
    it('debería interactuar con el elemento "Personas que quizá conozcas"', async function () {
        await driver.get("https://www.facebook.com/friends");
        await driver.wait(until.elementLocated(By.xpath('//span[text()="Personas que quizá conozcas"]')),10000);
        const elemento = await driver.findElement(By.xpath('//span[text()="Personas que quizá conozcas"]'));
        await elemento.click();
        assert(elemento,'El elemento con el texto "Personas que quizá conozcas" fue encontrado');
    });

    // 4.debería ver el Cumpleaños
    it('debería hacer clic en el elemento "Cumpleaños"', async function () {
        await driver.wait(until.elementLocated(By.xpath('//span[text()="Cumpleaños"]')),10000);
        const elemento = await driver.findElement(By.xpath('//span[text()="Cumpleaños"]'));
        
        await elemento.click();
        assert(elemento, 'El elemento con el texto "Cumpleaños" fue encontrado');
    });

    // 5.debería verificar las solicitudes de amistad pendientes'
    it("debería leer el texto del elemento de solicitudes de amistad", async function () {
        await driver.get("https://www.facebook.com/friends/requests");
        await driver.wait(until.elementLocated(By.css("h1.html-h1")), 10000);
        
        const elementoH1 = await driver.findElement(By.css("h1.html-h1"));
        const textoElemento = await elementoH1.getText();

        assert.strictEqual(textoElemento,"Solicitudes de amistad","El texto del elemento <h1> no es el esperado.");
    });


    //6.debería cancelar una solicitud de amistad enviada
    it("debería cancelar una solicitud de amistad enviada", async function () {
    await driver.get("https://www.facebook.com/friends/requests");
    await driver.wait(until.elementLocated(By.xpath('//span[text()="Ver solicitudes enviadas"]')), 10000);
    const verSolicitudesEnviadas = await driver.findElement(By.xpath('//span[text()="Ver solicitudes enviadas"]'));
    
    await verSolicitudesEnviadas.click();
   
    await driver.wait(until.elementLocated(By.xpath('//span[text()="Cancelar solicitud"]')), 10000); 
    const cancelarSolicitud = await driver.findElement(By.xpath('//span[text()="Cancelar solicitud"]'));
    
    await cancelarSolicitud.click();

    const solicitudCancelada = await driver.wait(until.elementLocated(By.xpath('//span[contains(text(), "Solicitud cancelada")]')), 10000);
    assert(solicitudCancelada, "Solicitud de amistad cancelada con éxito");
    });

 
    // 7.debería poder ver tus grupos
    it("debería mostrar tus grupos", async function () {
    await driver.get("https://www.facebook.com/groups/feed/");
    await driver.wait( until.elementLocated(By.xpath('//span[contains(text(), "Tus grupos")]')),10000);     
        
    const tusGruposElement = await driver.findElement(By.xpath('//span[contains(text(), "Tus grupos")]'));
    assert(tusGruposElement,"El elemento 'Tus grupos' se ha encontrado con éxito"); 
    
    await tusGruposElement.click();

    await driver.wait(until.elementLocated(By.css('div[role="list"]')), 10000);
    const gruposList = await driver.findElements(By.css('div[role="listitem"]'));
    console.log(`Se encontraron ${gruposList.length} grupos`);   
    for (let grupo of gruposList) { const nombreGrupo = await grupo.getText();
    console.log(`Grupo: ${nombreGrupo}`);}
    });

    after(async function () { await driver.quit();
    });

    // 8. Publicar una actualización de estado
    it("debería publicar una actualización de estado", async function () {
        await driver.get("https://www.facebook.com");
        const cajaPublicacion = await driver.findElement(By.xpath('//div[@role="button" and .//span[contains(text(), "¿Qué estás pensando, Sofix?")]]'));
        
        await cajaPublicacion.click();
    
        // Esperar y seleccionar el área de texto correcta
        await driver.wait(until.elementLocated(By.xpath('//*[@role="textbox" and @aria-label="¿Qué estás pensando, Sofix?"]')), 10000);
        const areaTexto = await driver.findElement(By.xpath('//*[@role="textbox" and @aria-label="¿Qué estás pensando, Sofix?"]'));
        
        await areaTexto.click(); // Asegúrate de que el área de texto esté activa
        await areaTexto.sendKeys("Appletv");
    
        // Encontrar y hacer clic en el botón "Publicar"
        const publicarElemento = await driver.findElement(By.xpath('//span[text()="Publicar"]'));
        
        await publicarElemento.click();
    });

    // 9. Dar like a una publicación
    it("debería dar like a una publicación", async function () {
        await driver.wait(until.elementLocated(By.css('div[aria-label="Me gusta"]')),10000);
        const botonLike = await driver.findElement(By.css('div[aria-label="Me gusta"]'));
        
        await botonLike.click();
    });

    // 10. Comentar en una publicación
    it("debería comentar en una publicación", async function () {
        await driver.wait(until.elementLocated(By.css('div[aria-label="Escribe un comentario…"]')),10000);
        const cajaComentario = await driver.findElement(By.css('div[aria-label="Escribe un comentario…"]'));
        
        await cajaComentario.click();
        await cajaComentario.sendKeys("¡paso!", Key.RETURN);
    });

    // 11. Enviar una publicación
    it("debería hacer clic en el botón Enviar", async function () {
        await driver.wait(until.elementLocated(By.xpath('//span[text()="Enviar"]')),10000);
        const botonEnviar = await driver.findElement(By.xpath('//span[text()="Enviar"]'));
        
        await botonEnviar.click();
    });



});
