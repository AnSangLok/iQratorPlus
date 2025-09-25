package kr.co.iQratorPlus.model.domain;
import java.util.List;

public class ChartData {
    private List<String> labels;
    private List<DataSet> datasets;

    // Getters and Setters

    public static class DataSet {
        private String label;
        private List<Double> data;
        private String borderColor;
        private boolean fill;

        // Getters and Setters
    }
}
