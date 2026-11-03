<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9"
  exclude-result-prefixes="sm"
>
  <xsl:output method="html" encoding="UTF-8" />

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>KheloLocal Sitemap</title>
        <style>
          :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #172033; background: #f7f8fa; }
          body { max-width: 880px; margin: 0 auto; padding: 48px 24px; }
          h1 { margin: 0; font-size: clamp(2rem, 5vw, 3rem); letter-spacing: -0.04em; }
          p { color: #606b7d; line-height: 1.6; }
          .count { margin: 8px 0 24px; font-size: 0.95rem; }
          table { width: 100%; border-collapse: collapse; overflow: hidden; border: 1px solid #e1e5eb; border-radius: 12px; background: #fff; }
          th, td { padding: 14px 18px; border-bottom: 1px solid #e9edf2; text-align: left; }
          th { background: #eef2f6; color: #485366; font-size: 0.78rem; letter-spacing: 0.08em; text-transform: uppercase; }
          tr:last-child td { border-bottom: 0; }
          a { color: #2457a7; text-decoration: none; overflow-wrap: anywhere; }
          a:hover { text-decoration: underline; }
          @media (max-width: 520px) { body { padding: 32px 16px; } th, td { padding: 12px; } }
        </style>
      </head>
      <body>
        <main>
          <h1>KheloLocal Sitemap</h1>
          <p class="count">
            <xsl:value-of select="count(/sm:urlset/sm:url)" />
            <xsl:text> public pages</xsl:text>
          </p>
          <p>This sitemap lists the public pages available on KheloLocal.</p>
          <table>
            <thead>
              <tr><th>Page URL</th></tr>
            </thead>
            <tbody>
              <xsl:for-each select="/sm:urlset/sm:url">
                <tr>
                  <td>
                    <a href="{sm:loc}"><xsl:value-of select="sm:loc" /></a>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
