import Head from "next/head";
import {PageContent, PageHeader, PageWrapper} from "@app/_example05app/containers/BaseLayout";
import {AuthRequired} from "@app/_example05app/containers/AuthRequired";
import {useIntl} from "@core/next/intl";
import {ItemList} from "./List";
import {css} from "@emotion/core";


const pageContentCss = css`
    background: transparent;
    padding: 26px;
`

const MarketplacePage = () => {
    const intl = useIntl()
    const PageTitleMsg = intl.formatMessage({ id: 'pages.marketplace.index.PageTitle' })

    return (
        <>
            <Head>
                <title>{PageTitleMsg}</title>
            </Head>
            <PageWrapper>
                <PageHeader title={PageTitleMsg}/>
                <PageContent css={pageContentCss}>
                    <AuthRequired>
                        <div>
                            <ItemList/>
                        </div>
                    </AuthRequired>
                </PageContent>
            </PageWrapper>
        </>
    )
}

export default MarketplacePage
