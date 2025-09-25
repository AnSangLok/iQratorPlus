package kr.co.iQratorPlus.statistics.domain;

import lombok.Data;

@Data
public class StatisticsDetailVO {
	private String detailId;
    private String modelId;
    private float MSE;
    private float RMSE;
    private float MAPE;
    private float R2;
}
