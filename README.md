<h3 align="center">
  filecatbox-randomizer
</h3>

## :rocket: Sobre a página:

Gere aleatóriamente conteúdo hosteado no [catbox.moe](https://catbox.moe/). O script é útil para usuários que desejam uma maneira rápida e fácil de navegar por uma variedade de conteúdo sem ter que procurá-las manualmente.

#### :wrench: Techs utilizadas:
* _HTML_
* _JS_
  * _NODEJS_
    * _SELENIUM_
* _CSS_

### :computer: Como instalar a aplicação:

```bash
git clone https://github.com/JonanthaW/filecatbox-randomizer.git
npm install selenium-webdriver firefox
node main.js
```

O script rodará em modo "-headless", ou seja, não abrirá nenhuma janela e tudo acontecerá pelo terminal.

* Sites encontrados pelo script aparecerão assim:
<p align="center">
  <img src="https://github.com/JonanthaW/filecatbox-randomizer/blob/main/assets/capture.PNG">
</p>

# :bulb: Detalhes:

*  Por padrão, o script abrirá apenas 1 janela do firefox atualizando a cada 50 milissegundos por meio de driver.sleep(). Você pode remover este código ou diminuir essa quantia livremente.
```
await driver.sleep(50) -> await driver.sleep(00);
```
    
*  A busca padrão dos arquivos é .MP4, mas o catbox.moe aceita outros formatos. (Os unicos formatos não aceitos são: .exe, .scr, .cpl, .doc*, .jar). Veja mais em [FAQ](https://catbox.moe/faq.php).
```
await driver.get(`https://files.catbox.moe/${url}.mp4`); -> await driver.get(`https://files.catbox.moe/${url}.webm`);
```
