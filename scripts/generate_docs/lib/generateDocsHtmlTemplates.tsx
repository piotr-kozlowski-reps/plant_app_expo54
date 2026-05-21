class HtmlTemplates {
  generateTopicHtml(commentPrepared: string[], index: number): string {
    const html = `<div style="margin-left: ${index * 32 + 32}px; font-weight: 600; text-decoration: underline; font-size: 16px">${this.generateInsideLines(commentPrepared)}</div>`;
    return html;
  }

  generateProcedureItemHtml(commentPrepared: string[], index: number): string {
    const html = `<div style="margin-left: ${index * 32 + 64}px; font-weight: 500; font-size: 16px; background-color: var(--color-procedure-item); padding: 8px; padding-left: 32px; border-radius: var(--border-radius); line-height: 1.4; margin-bottom: 8px">${this.generateInsideLines(commentPrepared)}</div>`;
    return html;
  }

  generateGuardHtml(commentPrepared: string[], index: number): string {
    const html = `<div style="margin-left: ${index * 32 + 64}px; font-weight: 500; font-size: 16px; background-color: var(--color-guard); padding: 8px; padding-left: 32px; border-radius: var(--border-radius); line-height: 1.4; margin-bottom: 8px; white-space: normal; box-sizing: border-box; max-width: calc(100% - ${index * 32 + 64}px); width: fit-content;">
    <p style="margin-bottom:-8px;"><b>zabezpieczenie:</b></p>
    ${this.generateInsideLines(commentPrepared)}</div>`;
    return html;
  }

  generateProcedureDescriptionHtml(
    commentPrepared: string[],
    index: number,
  ): string {
    const html = `<div style="margin-left: ${index * 32 + 64}px; font-weight: 500; font-size: 16px; background-color: var(--color-procedure-description); padding: 8px; padding-left: 32px; border-radius: var(--border-radius); line-height: 1.4; margin-bottom: 8px">
    ${this.generateInsideLines(commentPrepared)}</div>`;
    return html;
  }

  generateTransformApiHtml(commentPrepared: string[], index: number) {
    const html = `<div style="margin-left: ${index * 32 + 64}px; font-weight: 500; font-size: 16px; background-color: var(--color-api-item); padding: 8px; padding-left: 32px; border-radius: var(--border-radius); line-height: 1.4; margin-bottom: 8px">${this.generateInsideLines(commentPrepared)}</div>`;
    return html;
  }

  generateReportHtml(commentPrepared: string[], index: number) {
    const html = `<div style="margin-left: ${index * 64 + 64}px; font-weight: 500; font-size: 16px; background-color: var(--color-report); padding: 8px; padding-left: 32px; border-radius: var(--border-radius); line-height: 1.4; margin-bottom: 8px">${this.generateInsideLines(commentPrepared)}</div>`;
    return html;
  }

  generateH3Html(h3Title: string, index: number) {
    const html = `<h3 style="font-weight: 600; font-size: 14px; background-color: var(--color-gray); color: var(--color-dark); padding-top: 8px; padding-bottom: 8px; padding-left: 32px; padding-right: 32px; border-radius: var(--border-radius); width: fit-content; margin-top: -16px; margin-left: ${index * 64 + 96}px; opacity: 1; margin-bottom: 8px;">${h3Title}</h3>`;
    return html;
  }

  generateIndexHtml(htmlContent: string) {
    return this.generateMainHtml("dokumentacja index", htmlContent);
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
            --color-procedure-description: #9d89b3;
            --color-report: #f2ebca;
            --color-gray-darker: #B0B0B0;
            --color-procedure-item: #D1EDD1;
            --color-api-item: #cadbf2;
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
            font-family: "euclid", sans-serif; max-width: 80%; margin: 40px auto; line-height: 1.4;
            }
            h1 {
            font-family: "euclid"; font-weight: normal; background-color: var(--color-dark); color: var(--color-background_nuance); padding-top: 8px; padding-bottom: 8px; padding-left: 32px; padding-right: 32px; border-radius: var(--border-radius);
            }
            h2 {
            font-weight: 600; font-size: 20px; background-color: var(--color-gray-darker); color: var(--color-dark); padding-top: 8px; padding-bottom: 8px; padding-left: 32px; padding-right: 32px; border-radius: var(--border-radius); width: fit-content; margin-top: 48px;
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
      else {
        const lineWithoutStar = line.replace(/^\s*\*\s/, "");
        const lineWithNonBreakableSpaces = lineWithoutStar.replace(
          /\s/g,
          "&nbsp;",
        );
        html += `<p>${lineWithNonBreakableSpaces}</p>`;
      }
    }
    return html;
  }
}
export const htmlTemplates = new HtmlTemplates();
