<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
<xsl:template match="/">
<html>
<head>
    <title>Daily Water Calculator - XML Sitemap</title>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 2rem;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #1E90FF 0%, #0066CC 100%);
            color: white;
            padding: 3rem 2rem;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            font-weight: 700;
        }
        
        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        
        .stats {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-top: 2rem;
            flex-wrap: wrap;
        }
        
        .stat {
            background: rgba(255,255,255,0.2);
            padding: 1rem 2rem;
            border-radius: 10px;
            text-align: center;
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
        }
        
        .stat-label {
            font-size: 0.9rem;
            opacity: 0.8;
        }
        
        .content {
            padding: 0;
        }
        
        .url-item {
            border-bottom: 1px solid #f0f0f0;
            transition: all 0.3s ease;
        }
        
        .url-item:hover {
            background: #f8f9ff;
        }
        
        .url-header {
            padding: 1.5rem 2rem;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .url-main {
            flex: 1;
        }
        
        .url-link {
            color: #1E90FF;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
            display: block;
        }
        
        .url-link:hover {
            text-decoration: underline;
        }
        
        .url-meta {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }
        
        .meta-item {
            display: flex;
            align-items: center;
            gap: 0.3rem;
            color: #666;
            font-size: 0.9rem;
        }
        
        .meta-icon {
            width: 16px;
            height: 16px;
        }
        
        .priority {
            background: #10B981;
            color: white;
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
        }
        
        .priority.high { background: #10B981; }
        .priority.medium { background: #F59E0B; }
        .priority.low { background: #6B7280; }
        
        .image-info {
            margin-top: 1rem;
            padding: 1rem;
            background: #f8f9ff;
            border-radius: 10px;
            border-left: 4px solid #1E90FF;
        }
        
        .image-title {
            font-weight: 600;
            color: #333;
            margin-bottom: 0.5rem;
        }
        
        .image-caption {
            color: #666;
            font-size: 0.9rem;
        }
        
        .footer {
            padding: 2rem;
            text-align: center;
            background: #f8f9fa;
            color: #666;
        }
        
        @media (max-width: 768px) {
            body { padding: 1rem; }
            .header h1 { font-size: 2rem; }
            .stats { gap: 1rem; }
            .url-header { flex-direction: column; align-items: flex-start; }
            .url-meta { margin-top: 0.5rem; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💧 XML Sitemap</h1>
            <p>Daily Water Calculator - Professional Health Application</p>
            <div class="stats">
                <div class="stat">
                    <div class="stat-number"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></div>
                    <div class="stat-label">Total Pages</div>
                </div>
                <div class="stat">
                    <div class="stat-number"><xsl:value-of select="count(sitemap:urlset/sitemap:url/image:image)"/></div>
                    <div class="stat-label">Images</div>
                </div>
                <div class="stat">
                    <div class="stat-number">Today</div>
                    <div class="stat-label">Last Updated</div>
                </div>
            </div>
        </div>
        
        <div class="content">
            <xsl:for-each select="sitemap:urlset/sitemap:url">
                <div class="url-item">
                    <div class="url-header">
                        <div class="url-main">
                            <a class="url-link" href="{sitemap:loc}" target="_blank">
                                <xsl:value-of select="sitemap:loc"/>
                            </a>
                            <div class="url-meta">
                                <div class="meta-item">
                                    📅 <span><xsl:value-of select="sitemap:lastmod"/></span>
                                </div>
                                <div class="meta-item">
                                    🔄 <span><xsl:value-of select="sitemap:changefreq"/></span>
                                </div>
                            </div>
                            <xsl:if test="image:image">
                                <div class="image-info">
                                    <div class="image-title">🖼️ <xsl:value-of select="image:image/image:title"/></div>
                                    <div class="image-caption"><xsl:value-of select="image:image/image:caption"/></div>
                                </div>
                            </xsl:if>
                        </div>
                        <div>
                            <xsl:choose>
                                <xsl:when test="sitemap:priority &gt;= 0.8">
                                    <span class="priority high">High Priority</span>
                                </xsl:when>
                                <xsl:when test="sitemap:priority &gt;= 0.6">
                                    <span class="priority medium">Medium Priority</span>
                                </xsl:when>
                                <xsl:otherwise>
                                    <span class="priority low">Low Priority</span>
                                </xsl:otherwise>
                            </xsl:choose>
                        </div>
                    </div>
                </div>
            </xsl:for-each>
        </div>
        
        <div class="footer">
            <p>This sitemap contains <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs and is generated for Daily Water Calculator</p>
            <p>Built for optimal search engine indexing and user experience</p>
        </div>
    </div>
</body>
</html>
</xsl:template>
</xsl:stylesheet>