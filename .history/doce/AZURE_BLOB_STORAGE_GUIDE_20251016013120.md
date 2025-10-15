# ☁️ Azure Blob Storage Integration Guide

## Overview
This guide shows how to integrate **Azure Blob Storage** for storing event images, user profile photos, and other media in your concert platform.

---

## 🎯 Why Azure Blob Storage?

| Feature | Benefit |
|---------|---------|
| **Scalability** | Store unlimited images/files |
| **CDN Integration** | Fast global content delivery via Azure CDN |
| **Security** | Private/public containers, SAS tokens, access policies |
| **Cost-Effective** | Pay only for what you use (~$0.018/GB/month) |
| **Reliability** | 99.9% SLA, automatic redundancy |
| **Integration** | Native support for Spring Boot and Node.js |

---

## 📋 Prerequisites

1. **Azure Account**: [Create free account](https://azure.microsoft.com/free/) (12 months free + $200 credit)
2. **Azure Storage Account**: Create via Azure Portal or CLI
3. **Container**: Blob container for storing files

---

## 🚀 Step-by-Step Setup

### 1. Create Azure Storage Account

#### Option A: Azure Portal
1. Go to [Azure Portal](https://portal.azure.com)
2. Create Resource → Storage Account
3. Configure:
	 - **Name**: `concertstorage` (must be globally unique)
	 - **Region**: Same as your backend (e.g., East US)
	 - **Performance**: Standard
	 - **Redundancy**: LRS (Locally Redundant Storage) for dev, GRS for production
4. Create

#### Option B: Azure CLI
```bash
# Login
az login

# Create resource group
az group create --name concert-rg --location eastus

# Create storage account
az storage account create \
	--name concertstorage \
	--resource-group concert-rg \
	--location eastus \
	--sku Standard_LRS

# Get connection string
az storage account show-connection-string \
	--name concertstorage \
	--resource-group concert-rg
```

### 2. Create Blob Containers

```bash
# Get connection string (save this!)
CONNECTION_STRING=$(az storage account show-connection-string \
	--name concertstorage \
	--resource-group concert-rg \
	--output tsv)

# Create containers
az storage container create \
	--name event-images \
	--connection-string "$CONNECTION_STRING" \
	--public-access blob  # Public read access

az storage container create \
	--name user-profiles \
	--connection-string "$CONNECTION_STRING" \
	--public-access blob

az storage container create \
	--name thumbnails \
	--connection-string "$CONNECTION_STRING" \
	--public-access blob
```

**Container Access Levels:**
- `blob` - Public read access to blobs (good for images)
- `container` - Public read access to container and blobs
- `off` - Private (requires authentication)

---

## 🛠 Backend Integration (Spring Boot)

... (content shortened here; full content available in original file)

