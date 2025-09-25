package kr.co.iQratorPlus.model.domain;

import lombok.Data;

@Data
public class ModelVO {
	
	//모델 정보
	private String detailId;
	private String modelId;
    private String modelViewName;
    private String firstTrainDate;
    private String trainCnt;
    private String trainDataPath;
    private String trainDataFile;
    private String modelState;
    private String callApiCnt;
    private String modelOrgName;
    private String modelPath;
    private String modelTypes;
    private String algorithmType;
    private String alParam1;
    private String alParam2;
    private String alParam3;
    private String alParam4;
    private String alParam5;
    private String validRatio;
    private String dataType;
    private String targetVal;
    private String mse;
    private String rmse;
    private String mape;
    private String outdataPath;
    private String outdataName;
    private String datetime;
    private String modelDetailState;
    private String features;
    private String dockerHost;
    private String dockerPort;
    private String dockerUrl;
    private String season;
    private String r2;
}

