class HtmlTemplates {
  generateTopicHtml(commentPrepared: string[], marginLeft?: number): string {
    const html = `<div style="margin-left: ${marginLeft ? marginLeft : "32"}px; font-weight: 600; text-decoration: underline; font-size: 16px">${this.generateInsideLines(commentPrepared)}</div>`;
    return html;
  }

  generateProcedureItemHtml(
    commentPrepared: string[],
    marginLeft?: number,
  ): string {
    const html = `<div style="margin-left: ${marginLeft ? marginLeft : "64"}px; font-weight: 500; font-size: 16px; background-color: var(--color-procedure-item); padding: 8px; padding-left: 32px; border-radius: var(--border-radius); line-height: 1.4; margin-bottom: 8px">${this.generateInsideLines(commentPrepared)}</div>`;
    return html;
  }

  generateGuardHtml(commentPrepared: string[], marginLeft?: number): string {
    const html = `<div style="margin-left: ${marginLeft ? marginLeft : "64"}px; font-weight: 500; font-size: 16px; background-color: var(--color-guard); padding: 8px; padding-left: 32px; border-radius: var(--border-radius); line-height: 1.4; margin-bottom: 8px">
    <p style="margin-bottom:-8px;"><b>zabezpieczenie:</b></p>
    ${this.generateInsideLines(commentPrepared)}</div>`;
    return html;
  }

  generateProcedureDescriptionHtml(
    commentPrepared: string[],
    marginLeft?: number,
  ): string {
    const html = `<div style="margin-left: ${marginLeft ? marginLeft : "64"}px; font-weight: 500; font-size: 16px; background-color: var(--color-procedure-description); padding: 8px; padding-left: 32px; border-radius: var(--border-radius); line-height: 1.4; margin-bottom: 8px">
    ${this.generateInsideLines(commentPrepared)}</div>`;
    return html;
  }

  generateMainHtml(dir: string, htmlContent: string): string {
    const fullHtml = `
        <!DOCTYPE html>
        <html lang="pl">
        <head>
          <meta charset="UTF-8" />
          <title>Dokumentacja: ${dir}</title>
          <style>
          :root {
            --color-dark: #002539;
            --color-background_nuance: #FFFDF9;
            --color-gray: #C2C2C2;
            --color-procedure-description: #CAEAF2;
            --color-gray-darker: #B0B0B0;
            --color-procedure-item: #D1EDD1;
            --color-guard: #FDAFAF;
            --border-radius: 32px
            }
            @font-face {
            font-family: "euclid";
            src: url("./fonts/EuclidCircularBBold.ttf") format("truetype");
            font-weight: bold;
            font-style: bold;
            }
            @font-face {
            font-family: "euclid";
            src: url("./fonts/EuclidCircularBSemiBold.ttf") format("truetype");
            font-weight: semibold;
            font-style: semibold;
            }
            @font-face {
            font-family: "euclid";
            src: url("./fonts/EuclidCircularBRegular.ttf") format("truetype");
            font-weight: normal;
            font-style: normal;
            }
            @font-face {
            font-family: "euclid";
            src: url("./fonts/EuclidCircularBLight.ttf") format("truetype");
            font-weight: light;
            font-style: light;
            }
            body {
            font-family: "euclid", sans-serif; max-width: 900px; margin: 40px auto; line-height: 1.4;
            }
            h1 {
            font-family: "euclid"; font-weight: normal; background-color: var(--color-dark); color: var(--color-background_nuance); padding-top: 8px; padding-bottom: 8px; padding-left: 32px; padding-right: 32px; border-radius: var(--border-radius);
            }
            h2 {
            font-weight: 600; font-size: 20px; background-color: var(--color-gray-darker); color: var(--color-dark); padding-top: 8px; padding-bottom: 8px; padding-left: 32px; padding-right: 32px; border-radius: var(--border-radius); width: fit-content; margin-top: 48px;
            }
            h3{
                     font-weight: 600; font-size: 14px; background-color: var(--color-gray); color: var(--color-dark); padding-top: 8px; padding-bottom: 8px; padding-left: 32px; padding-right: 32px; border-radius: var(--border-radius); width: fit-content; margin-top: -16px; margin-left: 96px; opacity: 1; margin-bottom: 8px;
            }
            p {
            padding-top: -4px; padding-bottom: -4px;
            }
            code { background: #f5f5f5; padding: 2px 4px; }
            pre { background: #f5f5f5; padding: 10px; overflow: auto; }
          </style>
        </head>
        <body>
        ${htmlContent}
        </body>
        </html>
        `;

    return fullHtml;
  }

  ////priv
  private generateInsideLines(commentPrepared: string[]): string {
    let html = "";
    for (const line of commentPrepared) {
      if (line.includes("@separator")) html += `<br />`;
      else html += `<p>${line.replace("* ", "")}</p>`;
    }
    return html;
  }
}
export const htmlTemplates = new HtmlTemplates();
