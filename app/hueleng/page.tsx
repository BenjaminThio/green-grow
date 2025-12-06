export default function HuelengPage() {
    return (
        <main style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>

            <div>
                <div>
                    <h1 style={{ textAlign: 'center', color: 'green' }}>GreenGrow</h1>
                    <h2>Plant. Protect. Grow.</h2>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', backgroundColor: 'yellowgreen', borderRadius: '20px', padding: '10px', maxWidth: '300px' }}>
                <div>
                    Description
                </div>

                <div style={{ textAlign: 'center' }}>
                    Join community tree-planting events easily
                </div>

                <div style={{ textAlign: 'center' }}>
                    Connect with local environmental groups and participate in organized tree planting activities near you.
                </div>

                <div>
                    Scrollbar
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', minWidth: '100%' }}>
                    <div>
                        Previous
                    </div>

                    <div>
                        Next
                    </div>
                </div>

            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'center', marginTop: '10px' }}>
                <div style={{ borderRadius: '20px', border: '2px solid green', padding: '10px' }}>
                    Sign in with Google
                </div>

                <div style={{ borderRadius: '20px', border: '2px solid blue', padding: '10px' }}>
                    Sign in with Facebook
                </div>

                <div style={{ backgroundColor: 'yellowgreen', borderRadius: '20px', padding: '10px', minWidth: '300px' }}>
                    Create account
                </div>

                <div style={{ backgroundColor: 'yellowgreen', borderRadius: '20px', padding: '10px', minWidth: '300px' }}>
                    Sign in
                </div>

            </div>
        </main>
    );
}