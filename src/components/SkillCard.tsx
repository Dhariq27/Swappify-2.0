import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  Star, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Heart 
} from "lucide-react";

interface SkillCardProps {
  skill: {
    id: string;
    title: string;
    description: string;
    category: string;
    teacher: {
      name: string;
      avatar: string;
      rating: number;
      location: string;
    };
    wantedSkills: string[];
    duration: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    isOnline: boolean;
  };
}

const SkillCard = ({ skill }: SkillCardProps) => {
  const navigate = useNavigate();
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-success/10 text-success border-success/20';
      case 'Intermediate': return 'bg-warning/10 text-warning border-warning/20';
      case 'Advanced': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const handleProposeSwap = () => {
    toast.success(`Swap request sent to ${skill.teacher.name}!`);
    navigate('/chat');
  };

  const handleMessage = () => {
    navigate('/chat');
  };

  return (
    <Card className="card-hover group cursor-pointer">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <Badge variant="secondary" className="text-xs">
            {skill.category}
          </Badge>
          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        
        <div>
          <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
            {skill.title}
          </h3>
          <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
            {skill.description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Teacher Info */}
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={skill.teacher.avatar} alt={skill.teacher.name} />
            <AvatarFallback>{skill.teacher.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-medium text-sm">{skill.teacher.name}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-warning text-warning" />
                <span>{skill.teacher.rating}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{skill.teacher.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Skill Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{skill.duration}</span>
            </div>
            <Badge 
              variant="outline" 
              className={`text-xs ${getDifficultyColor(skill.difficulty)}`}
            >
              {skill.difficulty}
            </Badge>
            {skill.isOnline && (
              <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/20">
                Online
              </Badge>
            )}
          </div>

          {/* Wanted Skills */}
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-2">
              Looking for:
            </div>
            <div className="flex flex-wrap gap-1">
              {skill.wantedSkills.slice(0, 3).map((wantedSkill, index) => (
                <span key={index} className="skill-badge text-xs">
                  {wantedSkill}
                </span>
              ))}
              {skill.wantedSkills.length > 3 && (
                <span className="skill-badge text-xs">
                  +{skill.wantedSkills.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        <Button 
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={handleProposeSwap}
        >
          Propose Swap
        </Button>
        <Button variant="outline" size="icon" onClick={handleMessage}>
          <MessageCircle className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SkillCard;