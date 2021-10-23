const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()
const articles = []
const sources = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    },
    {
        name: 'theguardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: ''
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change',
        base: 'https://www.telegraph.co.uk/'
    }
]

sources.forEach(source => {
    axios.get(source.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            $('a:contains("climate")', html).each(function (){
                const title = $(this).text().trim()
                const url = $(this).attr('href')
                articles.push({
                    title, 
                    url: source.base + url,
                    source: source.name
                })
            })
        }).catch(err => {console.log(err)})
})

app.get('/',(req, res) => {
    res.json('Climate Change Scraper API')
})

app.get('/news', async (req, res) => {
    res.json(articles)
})

app.get('/news/:sourceId',(req, res) => {
    console.log(req.params.sourceId)
    const filteredArticles = articles.filter(article => article.name == req.params.sourceId)
    console.log(filteredArticles)
    res.json(filteredArticles)
})

app.listen(PORT, () => console.log(`server running on port ${PORT}`))
