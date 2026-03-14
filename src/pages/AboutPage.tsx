
import { useEffect } from 'preact/hooks'

export function AboutPage() {
    useEffect(() => {
        document.title = 'About — youdontneedpostman.com'

        const metaDesc = document.querySelector('meta[name="description"]')
        if (metaDesc) {
            metaDesc.setAttribute(
                'content',
                'youdontneedpostman.com is an independent site helping developers discover free, open-source Postman alternatives like Bruno and Yaak — and migrate their collections in the browser.',
            )
        }

        const ogTitle = document.querySelector('meta[property="og:title"]')
        if (ogTitle) ogTitle.setAttribute('content', 'About — youdontneedpostman.com')

        const ogDesc = document.querySelector('meta[property="og:description"]')
        if (ogDesc) ogDesc.setAttribute('content', 'An independent site helping developers find better API clients and migrate away from Postman — built for fun, with no affiliation to Bruno or Yaak.')
    }, [])

    return (
        <main class="alt-page">
            <section class="hero">
                <h1>About this site</h1>
                <p class="hero-sub">
                    An independent resource for developers looking for better API clients than Postman.
                </p>
            </section>

            <section class="about-content">
                <h2 class="section-title">What is this?</h2>
                <p>
                    <a href="https://youdontneedpostman.com">youdontneedpostman.com</a> exists as a central place for developers who are done with Postman's direction and want to know what else is out there. It lists the best free, open-source alternatives and provides a visual browser-based migration tool so you can convert your Postman collections to Bruno without installing anything.
                </p>

                <h2 class="section-title">Why it was built</h2>
                <p>
                    Honestly? For fun — and because I thought it should exist. Postman has made a series of choices that make it harder for individual developers and small teams to do their jobs, so a niche little site pointing toward better options felt worthwhile.
                </p>

                <h2 class="section-title">No affiliation</h2>
                <p>
                    This site has no affiliation with Bruno, Yaak, or any of the tools listed here. It was built independently and is maintained that way. All conversion runs entirely in your browser — nothing is ever sent to a server. It started with bruno's converters because I was familiar with the API and was easy for me to validate the implementation.
                </p>
            </section>
        </main>
    )
}
