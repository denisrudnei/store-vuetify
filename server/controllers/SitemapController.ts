import { createGzip } from 'zlib'
import { Router } from 'express'
import { SitemapStream, streamToPromise } from 'sitemap'

import consola from 'consola'
import { Category } from '../models/Category'
import { Product } from '../models/Product'

const SitemapController = Router()
let sitemap: Buffer

SitemapController.get('/sitemap.xml', async (_, res) => {
  const hostname = process.env.SITEMAP_BASE!

  res.header('Content-Type', 'application/xml')
  res.header('Content-Encoding', 'gzip')

  if (sitemap) {
    return res.send(sitemap)
  }

  try {
    const sitemapStream = new SitemapStream({
      hostname,
    })

    const pipeline = sitemapStream.pipe(createGzip())
    const products = await Product.find()
    const categories = await Category.find()

    for (const product of products) {
      sitemapStream.write({
        url: `${hostname}product/${product.id}`,
        changefreq: 'daily',
        priority: 0.9,
      })
    }

    for (const category of categories) {
      sitemapStream.write({
        url: `${hostname}categories/${category.slug}`,
        changefreq: 'daily',
        priority: 0.5,
      })
    }

    streamToPromise(pipeline).then((sm) => (sitemap = sm))
    sitemapStream.end()
    pipeline.pipe(res).on('error', (e) => {
      throw e
    })
  } catch (e) {
    consola.error(e)
    res.sendStatus(500)
  }
})

export { SitemapController }
