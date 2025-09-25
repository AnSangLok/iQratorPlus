package kr.co.iQratorPlus.database.mapper;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import kr.co.iQratorPlus.dashboard.domain.DashBoardVO;

@Repository
@Mapper
public interface DashBoardMapper {
	
	public HashMap<String, Object> selectModelCnt(HashMap<String, Object> paramMap);
	
	public DashBoardVO selectLatestGraph();
	
	public List<DashBoardVO> selectAlgorithmCnt();
	public List<DashBoardVO> selectCallApiCnt();
	public DashBoardVO selectMaxTrain();
	public List<DashBoardVO> selectMaxTrainDetail(DashBoardVO vo);
	public DashBoardVO selectLatestClusterModel();
}
