package kr.co.iQratorPlus.statistics.domain;

import lombok.Data;

@Data
public class StatisticsVO {
	private String modelId;
    private String modelViewName;
    private int trainCnt;
    private String trainDataFile;
    private float accuracy;
}
