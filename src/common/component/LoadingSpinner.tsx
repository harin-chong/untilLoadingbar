import './LoadingSpinner.css';

function LoadingSpinner() {
    return (
        <div className="loading-container">
            <div
                className="loading-spinner"
                role="status"
                aria-label="Loading"
            >
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}

export default LoadingSpinner;