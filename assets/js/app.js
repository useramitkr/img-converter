const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const uploadText = document.getElementById('uploadText');
const conversionOptions = document.getElementById('conversionOptions');
const qualityControl = document.getElementById('qualityControl');
const qualitySlider = document.getElementById('qualitySlider');
const qualityLabel = document.getElementById('qualityLabel');
const message = document.getElementById('message');
const resultsContainer = document.getElementById('resultsContainer');
const downloadAllBtn = document.getElementById('downloadAllBtn');

let originalFiles = [];
let convertedFiles = [];
let selectedFormat = null;
let conversionTimeout;

function showMessage(msg, type = 'success') {
    message.textContent = msg;
    message.className = `message ${type} show`;
}

function hideMessage() {
    message.classList.remove('show');
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function truncateFilename(fullName, maxLength = 7) {
    const lastDot = fullName.lastIndexOf('.');
    if (lastDot === -1) { // No extension
        if (fullName.length > maxLength) {
            return fullName.substring(0, maxLength) + '...';
        }
        return fullName;
    }

    const name = fullName.substring(0, lastDot);
    const ext = fullName.substring(lastDot);

    if (name.length > maxLength) {
        return name.substring(0, maxLength) + '...' + ext;
    }

    return fullName; // Name is short enough, return original
}

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, e => { e.preventDefault(); e.stopPropagation(); }, false);
});
['dragenter', 'dragover'].forEach(eventName => {
    uploadArea.addEventListener(eventName, () => uploadArea.classList.add('drag-over'), false);
});
['dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('drag-over'), false);
});
uploadArea.addEventListener('drop', e => {
    fileInput.files = e.dataTransfer.files;
    handleFiles({ target: fileInput });
});

fileInput.addEventListener('change', handleFiles);

function handleFiles(e) {
    const files = e.target.files;
    if (files.length === 0) return;

    const newFiles = Array.from(files).filter(file => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type));

    if (newFiles.length !== files.length) {
        showMessage("Some files were ignored. Only JPG, PNG, or WebP are supported.", "error");
    }
    if (newFiles.length === 0) return;

    newFiles.forEach(file => {
        const newIndex = originalFiles.length;
        originalFiles.push(file);
        convertedFiles.push(null);
        const reader = new FileReader();
        reader.onload = (event) => {
            const resultItem = createResultItem(newIndex, file, event.target.result);
            resultsContainer.appendChild(resultItem);
        };
        reader.readAsDataURL(file);
    });

    uploadText.textContent = `${originalFiles.filter(f => f).length} file(s) selected`;
    conversionOptions.style.display = 'flex';
    if (selectedFormat) {
        convertAllFiles();
    }
}


function createResultItem(index, file, src) {
    const item = document.createElement('div');
    item.className = 'result-item';
    item.dataset.index = index;
    const displayedOriginalName = truncateFilename(file.name);
    item.innerHTML = `
                <div class="delete-btn" title="Remove image">&times;</div>
                <div class="image-display">
                    <img src="${src}" alt="Original">
                    <div class="image-info">
                        <span class="filename" title="${file.name}">${displayedOriginalName}</span>
                        <span class="filesize">${formatBytes(file.size)}</span>
                    </div>
                </div>
                <div class="status-wrapper">
                    <div class="status-text pending">Pending Format</div>
                </div>
                <div class="download-wrapper">
                    <a id="dl-conv-${index}" class="download-btn disabled">Download</a>
                </div>
            `;
    return item;
}

resultsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const item = e.target.closest('.result-item');
        if (item) {
            const index = parseInt(item.dataset.index, 10);
            originalFiles[index] = null;
            convertedFiles[index] = null;
            item.style.transition = 'opacity 0.3s ease';
            item.style.opacity = '0';
            setTimeout(() => {
                item.remove();
                updateUIState();
            }, 300);
        }
    }
});

function updateUIState() {
    const remainingOriginals = originalFiles.filter(f => f !== null).length;
    uploadText.textContent = remainingOriginals > 0 ? `${remainingOriginals} file(s) selected` : 'Drop files here or click to select';

    if (remainingOriginals === 0) {
        conversionOptions.style.display = 'none';
        qualityControl.style.display = 'none';
        downloadAllBtn.style.display = 'none';
        hideMessage();
        selectedFormat = null;
        document.querySelectorAll('.conversion-option').forEach(opt => opt.classList.remove('selected'));
        originalFiles = [];
        convertedFiles = [];
        fileInput.value = ''; // Reset file input
    }

    const remainingConverted = convertedFiles.filter(f => f !== null).length;
    if (remainingConverted > 0 && remainingConverted === remainingOriginals) {
        downloadAllBtn.style.display = 'inline-flex';
    } else {
        downloadAllBtn.style.display = 'none';
    }
}


conversionOptions.addEventListener('click', (e) => {
    const target = e.target.closest('.conversion-option');
    if (!target || originalFiles.filter(f => f).length === 0) return;

    document.querySelectorAll('.conversion-option').forEach(opt => opt.classList.remove('selected'));
    target.classList.add('selected');
    selectedFormat = target.dataset.format;

    if (selectedFormat === 'jpeg' || selectedFormat === 'webp') {
        const defaultQuality = selectedFormat === 'webp' ? 80 : 90;
        qualitySlider.value = defaultQuality;
        qualityLabel.textContent = `Quality: ${defaultQuality}%`;
        qualityControl.style.display = 'block';
    } else {
        qualityControl.style.display = 'none';
    }
    convertAllFiles();
});

qualitySlider.addEventListener('input', (e) => {
    qualityLabel.textContent = `Quality: ${e.target.value}%`;
    clearTimeout(conversionTimeout);
    conversionTimeout = setTimeout(convertAllFiles, 250);
});

async function convertAllFiles() {
    if (!selectedFormat) return;

    showMessage(`Converting to ${selectedFormat.toUpperCase()}... ✨`, 'success');
    downloadAllBtn.style.display = 'none';

    const activeFiles = originalFiles.map((file, index) => ({ file, index })).filter(item => item.file);

    const conversionPromises = activeFiles.map(({ file, index }) => {
        const itemUI = resultsContainer.querySelector(`.result-item[data-index='${index}']`);
        return convertImage(file, itemUI, index);
    });

    await Promise.allSettled(conversionPromises);

    const successfulConversions = convertedFiles.filter(f => f).length;
    if (successfulConversions > 0) {
        if (successfulConversions === activeFiles.length) {
            showMessage(`Conversion complete! Ready to download.`, 'success');
        } else {
            showMessage(`Completed with ${activeFiles.length - successfulConversions} error(s).`, 'error');
        }
        downloadAllBtn.style.display = 'inline-flex';
    } else if (activeFiles.length > 0) {
        showMessage(`Conversion failed for all images.`, 'error');
    } else {
        hideMessage();
    }
}

async function convertImage(file, ui, index) {
    if (!ui) return;
    const statusWrapper = ui.querySelector('.status-wrapper');
    statusWrapper.innerHTML = `<div class="status-text pending">Converting...</div>`;

    try {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise((r, j) => { img.onload = r; img.onerror = j; });

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const mimeType = `image/${selectedFormat}`;
        let quality = (selectedFormat === 'jpeg' || selectedFormat === 'webp') ? (parseInt(qualitySlider.value) / 100) : 1.0;

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Canvas toBlob failed.'));
                    return;
                }

                const convertedUrl = URL.createObjectURL(blob);
                const baseName = file.name.split('.').slice(0, -1).join('.');
                const newFileName = `${baseName}.${selectedFormat}`;

                convertedFiles[index] = { name: newFileName, blob };

                const displayedFileName = truncateFilename(newFileName);

                statusWrapper.innerHTML = `
                        <div class="image-display">
                            <img src="${convertedUrl}" alt="Converted">
                            <div class="image-info">
                                <span class="filename" title="${newFileName}">${displayedFileName}</span>
                                <span class="filesize">${formatBytes(blob.size)}</span>
                            </div>
                        </div>`;

                const downloadLink = ui.querySelector(`#dl-conv-${index}`);
                downloadLink.href = convertedUrl;
                downloadLink.download = newFileName;
                downloadLink.classList.remove('disabled');

                resolve();
            }, mimeType, quality);
        });

    } catch (error) {
        console.error("Conversion error:", error);
        statusWrapper.innerHTML = `<div class="status-text error">Failed</div>`;
        convertedFiles[index] = null; // Mark as failed
        return Promise.reject(error);
    }
}

downloadAllBtn.addEventListener('click', () => {
    const zip = new JSZip();
    let downloadableFiles = 0;

    convertedFiles.forEach(file => {
        if (file && file.blob) {
            zip.file(file.name, file.blob);
            downloadableFiles++;
        }
    });

    if (downloadableFiles > 0) {
        zip.generateAsync({ type: 'blob' }).then(content => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = 'converted_images.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    } else {
        showMessage('No successful conversions to download.', 'error');
    }
});